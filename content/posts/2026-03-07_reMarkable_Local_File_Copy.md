Title: reMarkable: Local File Transfer Without the Cloud
Date: 2026-03-07
Category: Tools
Tags: reMarkable, eink, PDF, privacy, Linux
Author: morganp
Summary: How to use the reMarkable tablet without cloud sync by unpairing the device and enabling the built-in USB file server at http://10.11.99.1/.

The reMarkable tablet is excellent for reading and annotating PDFs, but by default it routes
everything through reMarkable's cloud. If you prefer to keep files local -- for privacy, or
simply because you do not want a subscription -- you can unpair the device and use the
built-in USB file server instead.

---

## Table of Contents

1. [Unpairing from the Cloud](#1-unpairing-from-the-cloud)
2. [Enabling the USB Web Interface](#2-enabling-the-usb-web-interface)
3. [Transferring Files via http://10.11.99.1/](#3-transferring-files)
4. [Tips and Limitations](#4-tips-and-limitations)

---

## 1. Unpairing from the Cloud

Unpairing stops the device from syncing to reMarkable's servers. Your existing documents
remain on the device; they are simply no longer backed up or accessible from the reMarkable
apps on other devices.

**On the tablet:**

1. Open **Settings** (gear icon, bottom-left of the home screen)
2. Go to **Storage**
3. Tap **Unpair device**
4. Confirm when prompted

Once unpaired, the tablet no longer requires a reMarkable account or internet connection for
normal use. The cloud sync icon will disappear from the top bar.

> **Note:** Unpairing is reversible. You can re-pair the device at any time from the same
> Settings screen by signing back in to your reMarkable account.

---

## 2. Enabling the USB Web Interface

The reMarkable has a built-in HTTP file server that becomes accessible over USB. When enabled,
the tablet presents itself as a USB network adapter and serves files at `http://10.11.99.1/`.

**On the tablet:**

1. Open **Settings**
2. Go to **Storage**
3. Enable **USB transfer** (the toggle may be labelled "USB web interface" depending on
   firmware version)

**Connect the tablet to your computer** using the supplied USB-C cable. The tablet will
appear as a network device (USB Ethernet adapter) rather than a mass storage drive.

On Linux the interface typically appears as `usb0` or `enp0s20u1` and receives an address in
the `10.11.99.0/24` subnet automatically via DHCP from the tablet.

Verify connectivity:

```bash
ping 10.11.99.1
```

---

## 3. Transferring Files

Open a browser and navigate to:

```
http://10.11.99.1/
```

The web interface shows all documents and notebooks currently on the device, organised in
folders matching the tablet's home screen layout.

### Uploading PDFs

1. Click **Import** (or the upload button, top-right)
2. Select one or more PDF files from your computer
3. The files appear on the tablet home screen immediately -- no restart required

Supported formats: **PDF** and **EPUB**.

### Downloading annotated files

1. Click on any document in the web interface
2. Select **Download** to save the annotated PDF to your computer

The downloaded file includes all pencil annotations, highlights, and notes made on the tablet.

### Command-line upload with curl

For scripting or batch uploads:

```bash
curl -X POST http://10.11.99.1/documents/ \
  -F "file=@/path/to/document.pdf"
```

To upload into a specific folder, first find the folder UUID from the web interface URL, then:

```bash
curl -X POST "http://10.11.99.1/documents/{folder-uuid}" \
  -F "file=@/path/to/document.pdf"
```

---

## 4. Tips and Limitations

- **No Wi-Fi required.** The USB file server works entirely over the USB cable with no network
  connection needed.
- **Cable must stay connected.** The web interface is only available while the tablet is
  plugged in. Unplugging immediately drops the `10.11.99.1` address.
- **One client at a time.** The built-in server is minimal; avoid opening multiple browser
  tabs uploading simultaneously.
- **Folder structure is flat internally.** The reMarkable stores documents with UUIDs
  internally; the folder hierarchy you see in the web interface is a virtual view maintained
  by the device.
- **Firmware updates still work offline.** Updates are downloaded over Wi-Fi separately from
  the cloud sync; unpairing does not block firmware updates if Wi-Fi is available.
- **Annotations on existing PDFs** are exported as a new annotated PDF -- the original on-
  device file is not modified.
