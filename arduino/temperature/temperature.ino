#include <SPI.h>
#include <Ethernet.h>
#include <OneWire.h>
#include <DallasTemperature.h>
 
byte mac[]        = { 0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x02 }; // MAC Address
char serverName[] = "slack-coffee-app.herokuapp.com";                        // Hostname
int delayTime     = 10000;                                 // Delaytime to try again

// Data wire is plugged into pin 2 on the Arduino
#define ONE_WIRE_BUS 2

// Setup a oneWire instance to communicate with any OneWire devices 
// (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature.
DallasTemperature sensors(&oneWire);

// Initialize the Ethernet client library
EthernetClient client;

// Setup Arduino basics
void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);

  // Start up the library
  sensors.begin();

  Serial.println("Initializing");
  
  // start the Ethernet connection through DHCP:
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // no point in carrying on, so do nothing forevermore:
    while(true);
  }
  
  // give the Ethernet shield a second to initialize:
  delay(1000);
  
  // serve IP Address
  Serial.print("IP address: ");
  Serial.println(Ethernet.localIP());
  
  // Give some gas!
  httpRequest();
}

void loop()
{  
  // if there are incoming bytes available 
  // from the server, read them and print them:
  if (client.available()) {
    char c = client.read();
    Serial.print(c);
  }

  // if the server's disconnected, stop the client:
  if (!client.connected()) {
    Serial.println();
    Serial.println("disconnecting.");
    client.stop();

    // set timer to hold on for
    delay(delayTime);
    
    // Give some gas again
    httpRequest();
  }
}

// HTTP request himself
void httpRequest()
{
  Serial.println(" Requesting temperatures...");
  sensors.requestTemperatures(); // Send the command to get temperatures
  Serial.print("Temperature for Device 1 is: ");
  Serial.println(sensors.getTempCByIndex(0)); // Why "byIndex"? 

  String data = "temp=";
  data+=sensors.getTempCByIndex(0);

  Serial.println(data);

  Serial.print("Connecting...");
    
  // if you get a connection, report back via serial:
  if (client.connect(serverName, 80)) {
    Serial.println("connected");

    client.println("POST /temperature/update HTTP/1.1");
    client.println("Host: slack-coffee-app.herokuapp.com");
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.println("Connection: close");
    client.print("Content-Length: ");
    client.println(data.length());
    client.println();
    client.print(data);
    client.println(); 

  } 
  else {
    // if you didn't get a connection to the server:
    Serial.println("connection failed");
  }
}
