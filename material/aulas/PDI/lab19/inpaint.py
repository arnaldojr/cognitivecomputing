#!/usr/bin/env python3

"""
Inpainting sample (Python 3 + OpenCV atual)

Uso:
  python inpaint_fixed.py [imagem]

Teclas:
  SPACE - executar inpainting
  r     - resetar máscara
  ESC   - sair
"""

import sys
import cv2
import numpy as np


drawing = False
radius = 5


def main():
    global drawing

    try:
        fn = sys.argv[1]
    except IndexError:
        fn = "fruits.jpg"

    print(__doc__)

    img = cv2.imread(fn, cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f"Não foi possível abrir a imagem: {fn}")

    img_mark = img.copy()
    mark = np.zeros(img.shape[:2], dtype=np.uint8)

    window_name = "img"
    result_name = "inpaint"

    def on_mouse(event, x, y, flags, param):
        global drawing
        img_mark_local, mark_local = param

        if event == cv2.EVENT_LBUTTONDOWN:
            drawing = True
            cv2.circle(img_mark_local, (x, y), radius, (255, 255, 255), -1, lineType=cv2.LINE_AA)
            cv2.circle(mark_local, (x, y), radius, 255, -1, lineType=cv2.LINE_AA)

        elif event == cv2.EVENT_MOUSEMOVE and drawing:
            cv2.circle(img_mark_local, (x, y), radius, (255, 255, 255), -1, lineType=cv2.LINE_AA)
            cv2.circle(mark_local, (x, y), radius, 255, -1, lineType=cv2.LINE_AA)

        elif event == cv2.EVENT_LBUTTONUP:
            drawing = False
            cv2.circle(img_mark_local, (x, y), radius, (255, 255, 255), -1, lineType=cv2.LINE_AA)
            cv2.circle(mark_local, (x, y), radius, 255, -1, lineType=cv2.LINE_AA)

    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
    cv2.setMouseCallback(window_name, on_mouse, [img_mark, mark])

    while True:
        cv2.imshow(window_name, img_mark)

        ch = cv2.waitKey(20) & 0xFF

        if ch == 27:  # ESC
            break

        elif ch == ord(' '):
            # Aplica sobre a imagem original usando a máscara desenhada
            res = cv2.inpaint(img, mark, 3, cv2.INPAINT_TELEA)
            cv2.imshow(result_name, res)

        elif ch == ord('r'):
            img_mark[:] = img
            mark[:] = 0
            cv2.imshow(window_name, img_mark)

    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()