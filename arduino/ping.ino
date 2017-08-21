#include <SPI.h>
#include <Ethernet.h>

byte mac[]        = {  0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x02 }; // MAC Address
char serverName[] = "google.com";                        // Hostname
int delayTime     = 30000;                                    // Delaytime to try again

// Initialize the Ethernet client library
EthernetClient client;

// Setup Arduino basics
void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
  
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
  Serial.print("Connecting...");
    
  // if you get a connection, report back via serial:
  if (client.connect(serverName, 80)) {
    Serial.println("connected");
    // Make a HTTP request:
    client.println("GET / HTTP/1.1");
    client.println("Host: google.com");
    client.println();
  } 
  else {
    // if you didn't get a connection to the server:
    Serial.println("connection failed");
  }
}
