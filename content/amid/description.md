# [`amid`](https://github.com/wazo-platform/wazo-amid)

## Description

A daemon for interacting with [Asterisk's AMI](https://docs.asterisk.org/Configuration/Interfaces/Asterisk-Manager-Interface-AMI) :

* forward AMI events to RabbitMQ ;
* expose HTTP JSON interface for AMI actions.

Once a user is authenticated against Wazo platform, he can query the `amid` service to receive `AMI` events from Asterisk and push `AMI` command to it.

The `amid` service also proxies the AMI event to our event bus.

## Schema

![amid schema](diagram.svg)

## API documentation

The REST API for wazo-ami is available [here](../api/amid.html)

## Related

* [wazo-amid](https://github.com/wazo-platform/wazo-amid)
* [wazo-amid-client](https://github.com/wazo-platform/wazo-amid-client)
