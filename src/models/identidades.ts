import FireFly from "@hyperledger/firefly-sdk";

export class Identidades{ 
    static identidade = new FireFly({host: 'http://localhost:5000', namespace: 'default'});
}