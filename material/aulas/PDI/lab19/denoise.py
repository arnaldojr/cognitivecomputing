#!/usr/bin/env python3
"""
Wiener deconvolution (Python 3 + OpenCV 4.x)

Uso:
  python deconvolution_fixed.py [--circle] [--angle GRAUS] [--d DIAMETRO] [--snr SNR_DB] [imagem]

Teclas:
  SPACE - alterna entre PSF linear (motion blur) e circular (defocus)
  ESC   - sair
"""

import sys
import math
import argparse
import numpy as np
import cv2


def blur_edge(img, d=31):
    """Suaviza as bordas para reduzir ringing na FFT."""
    h, w = img.shape[:2]
    img_pad = cv2.copyMakeBorder(img, d, d, d, d, cv2.BORDER_WRAP)
    img_blur = cv2.GaussianBlur(img_pad, (2 * d + 1, 2 * d + 1), 0)[d:-d, d:-d]

    y, x = np.indices((h, w))
    dist = np.dstack([x, w - x - 1, y, h - y - 1]).min(axis=-1)
    weight = np.minimum(dist.astype(np.float32) / d, 1.0)

    return img * weight + img_blur * (1.0 - weight)


def motion_kernel(angle_rad, d, sz=65):
    """
    Gera PSF de motion blur com comprimento d e ângulo angle_rad.
    """
    d = max(1, int(d))
    kern = np.ones((1, d), np.float32)

    c, s = np.cos(angle_rad), np.sin(angle_rad)
    A = np.float32([[c, -s, 0],
                    [s,  c, 0]])

    sz2 = sz // 2
    A[:, 2] = (sz2, sz2) - np.dot(A[:, :2], ((d - 1) * 0.5, 0))
    kern = cv2.warpAffine(kern, A, (sz, sz), flags=cv2.INTER_CUBIC)

    return kern


def defocus_kernel(d, sz=65):
    """
    Gera PSF circular para desfoque de foco.
    Aqui d é tratado como diâmetro aproximado.
    """
    d = max(1, int(d))
    radius = max(1, int(round(d / 2.0)))

    kern = np.zeros((sz, sz), np.float32)
    center = (sz // 2, sz // 2)
    cv2.circle(kern, center, radius, 1.0, thickness=-1, lineType=cv2.LINE_AA)

    s = kern.sum()
    if s > 0:
        kern /= s
    return kern


def psf_to_otf(psf, out_shape):
    """
    Converte PSF espacial em OTF (resposta em frequência),
    deslocando o centro da PSF para a origem antes da DFT.
    """
    psf_pad = np.zeros(out_shape, np.float32)
    kh, kw = psf.shape
    psf_pad[:kh, :kw] = psf

    # Move o centro da PSF para a origem (0,0)
    psf_pad = np.roll(psf_pad, -kh // 2, axis=0)
    psf_pad = np.roll(psf_pad, -kw // 2, axis=1)

    otf = cv2.dft(psf_pad, flags=cv2.DFT_COMPLEX_OUTPUT)
    return otf


def wiener_deconvolution(img, psf, snr_db):
    """
    Aplica Wiener deconvolution no domínio da frequência.
    Usa a forma geral com conjugado complexo:
        F_hat = conj(H) / (|H|^2 + K) * G
    onde K ~ 1 / SNR
    """
    img = img.astype(np.float32)
    psf = psf.astype(np.float32)

    # Garante PSF normalizada
    psf_sum = psf.sum()
    if psf_sum <= 0:
        raise ValueError("PSF inválida: soma <= 0.")
    psf = psf / psf_sum

    G = cv2.dft(img, flags=cv2.DFT_COMPLEX_OUTPUT)
    H = psf_to_otf(psf, img.shape)

    # |H|^2
    H_mag2 = H[..., 0] ** 2 + H[..., 1] ** 2

    # K = 1 / SNR, com SNR em dB
    K = 10.0 ** (-snr_db / 10.0)

    # conj(H)
    H_conj = H.copy()
    H_conj[..., 1] *= -1.0

    # Wiener filter
    W = H_conj / (H_mag2 + K)[..., np.newaxis]

    # Aplica filtro
    F_hat = cv2.mulSpectrums(G, W, flags=0)

    # Volta ao domínio espacial
    f_hat = cv2.idft(F_hat, flags=cv2.DFT_SCALE | cv2.DFT_REAL_OUTPUT)

    return f_hat


def main():
    parser = argparse.ArgumentParser(description="Wiener deconvolution com OpenCV")
    parser.add_argument("image", nargs="?", default="licenseplate_motion.jpg",
                        help="caminho da imagem de entrada")
    parser.add_argument("--circle", action="store_true",
                        help="usa PSF circular (defocus) em vez de motion blur")
    parser.add_argument("--angle", type=float, default=135.0,
                        help="ângulo do motion blur em graus")
    parser.add_argument("--d", type=int, default=22,
                        help="diâmetro/comprimento da PSF")
    parser.add_argument("--snr", type=float, default=25.0,
                        help="SNR em dB")
    args = parser.parse_args()

    img_u8 = cv2.imread(args.image, cv2.IMREAD_GRAYSCALE)
    if img_u8 is None:
        raise FileNotFoundError(f"Não foi possível abrir a imagem: {args.image}")

    img = img_u8.astype(np.float32) / 255.0
    img = blur_edge(img)

    cv2.namedWindow("input", cv2.WINDOW_NORMAL)
    cv2.namedWindow("deconvolution", cv2.WINDOW_NORMAL)
    cv2.namedWindow("psf", cv2.WINDOW_NORMAL)

    cv2.imshow("input", img)

    win = "deconvolution"
    defocus = args.circle

    def update(_=None):
        nonlocal defocus

        angle_deg = cv2.getTrackbarPos("angle", win)
        d = max(1, cv2.getTrackbarPos("d", win))
        snr_db = max(1, cv2.getTrackbarPos("SNR (db)", win))

        if defocus:
            psf = defocus_kernel(d)
        else:
            psf = motion_kernel(math.radians(angle_deg), d)

        psf_show = psf.copy()
        psf_show = psf_show / (psf_show.max() + 1e-8)
        cv2.imshow("psf", psf_show)

        res = wiener_deconvolution(img, psf, snr_db)
        res_show = np.clip(res, 0.0, 1.0)
        cv2.imshow(win, res_show)

    cv2.createTrackbar("angle", win, int(args.angle), 180, update)
    cv2.createTrackbar("d", win, int(args.d), 50, update)
    cv2.createTrackbar("SNR (db)", win, int(args.snr), 50, update)

    update()

    while True:
        ch = cv2.waitKey(30) & 0xFF
        if ch == 27:  # ESC
            break
        elif ch == ord(" "):
            defocus = not defocus
            update()

    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()