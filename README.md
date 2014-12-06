# mpd2fm

> tinyfm mdp to FM transmitter bridge.

mpd2fm tracks *tinyfm* tracks and turn them into FM modulations.

# Requirements

- a [Raspberry Pi with an antenna/metalic wire](http://makezine.com/projects/make-38-cameras-and-av/raspberry-pirate-radio/#steppers);
- a [tinyfm sandbox](https://github.com/tinyfm/sandbox)-like Pi configuration;

# Install

```bash
npm install -g git+https://github.com/tinyfm/mpd2fm.git
```

# Usage

Use `mpd2fm --help` to display help about available commands.

## init.d config

Prints out the Debian `initd` config.

```bash
mpd2fm --initd-config
```

Pretty much handy to daemonize the command-line tool on a Raspberry Pi.

## Playback events to FM

Listens to tinyfm audio playback events (backed by [mopidy](https://www.mopidy.com/)) and broadcasts them as an FM signal.

```
mpd2fm --base-dir /usr/share/tinyfm --start
```