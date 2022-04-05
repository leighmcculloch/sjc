#!/bin/sh

installdir="${SJC_INSTALL:-$HOME/.bin}"
installloc="$installdir/sjc"
version="${SJC_VERSION:-0.4.0}"
sys="$(uname -sm)"
bin=
case "$sys" in
  "Linux x86_64") bin=sjc-linux-amd64 ;;
  "Darwin x86_64") bin=sjc-macos-amd64;;
  "Darwin arm64") bin=sjc-macos-arm64 ;;
  *) echo "Unrecognized operating system or architecture: $sys"; exit 1 ;;
esac

echo "Installing sjc $version ($sys) to $installdir..."

mkdir -p "$installdir"
curl --progress-bar -SL -o "$installloc" "https://github.com/leighmcculloch/sjc/releases/download/$version/$bin"
chmod +x "$installloc"

echo "Installed to $installloc."
echo "Add $installdir to your PATH."
