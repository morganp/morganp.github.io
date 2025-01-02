Title: Starting with ProxMox
Date: 2024-10-24 12:56 
Category: Tech
Tags: proxmox
Author: morganp


Having decided that [Proxmox][proxmox] is the way forward to manage docker and ivrtualisation outside of the synology NAS. i need to figure out how to install , use and manage proxmox.

For the first instance I will be following the [guide to Proxmox][proxmox guide].

There is another good tutorial [here][ha] which covers installing proxmox and then creating a virtual machine for home assistant.


Note from [][proxmox docker]:

    > You manage a Docker instance from the host, using the Docker Engine command-line interface. It is not recommended to run docker directly on your Proxmox VE host. If you want to run application containers, for example, Docker images, it is best to run them inside a Proxmox QEMU VM.


[proxmox guide]: https://noted.lol/proxmox-for-beginners/
[proxmox]: https://www.proxmox.com/en/
[proxmox docker]: https://pve.proxmox.com/pve-docs/chapter-pve-faq.html#:~:text=You%20manage%20a%20Docker%20instance,inside%20a%20Proxmox%20QEMU%20VM.

[ha]: https://www.derekseaman.com/2023/10/home-assistant-proxmox-ve-8-0-quick-start-guide-2.html
