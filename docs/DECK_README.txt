TAROT DECK COMPLETE

Contents
--------
Cards/                 78 normalized tarot card fronts (440 x 858 PNG)
tarot_card_back.png     Production card back (440 x 858 PNG)
Animation/
  index.html            Interactive reusable 3D flip demo
  styles.css            Flip animation styles
  script.js             Card selector + upright/reversed behavior
  flip_demo_the_fool.gif Rendered sample flip animation
QA/                     Contact sheet, normalization audit, verification

How to preview the animation
----------------------------
Open Animation/index.html in a browser. Choose any card, click the card or the Flip card button.
The Reversed card checkbox rotates only the front artwork 180 degrees while leaving the symmetric back unchanged.

Production geometry
-------------------
Fronts: 440 x 858 px
Back:   440 x 858 px
Aspect: 220:429 (~1:1.95)

Animation behavior
------------------
The card is a two-face 3D object. The outer card flips around the Y axis; the front is pre-rotated 180 degrees so it appears upright after the turn. Reversed tarot orientation is a separate 180-degree Z rotation applied only to the front image.
