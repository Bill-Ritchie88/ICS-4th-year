// Tell the Arduino that our circuit is plugged into Pin 6
const int ledPin = 6;

void setup() {
  // Configure Pin 6 as an OUTPUT so it can send power out
  pinMode(ledPin, OUTPUT);
  
  // Turn the power ON! 
  digitalWrite(ledPin, HIGH);
}

void loop() {
  // We leave this empty because we don't want the Arduino 
  // to change anything or turn the light off.
}