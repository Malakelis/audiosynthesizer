Biquad frequency response cuts off some signals, attentuates others
second order not perfect but can be perfected

design decision was to use cascaded biquad filters to avoid the instability of higher order filters.
To get the accuracy of the 10th order, I decided to use five biquad filters.

Logarithmic slider to work well at lower levels we want

LFO is being used to modulate the signal while being connected to the four primary oscillators.
This creates a vibrato effect which is a periodic change in the pitch of the note.
Amount of the LFO gain is the vibratoAmount.