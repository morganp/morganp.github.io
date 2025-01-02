Title: Synology Connecting Across VLAN with active VPN
Date: 2024-10-16 11:30 
Category: Tech 
Tags: Synology, networking, VLAN, VPN
Author: morganp

When a Synology NAS creates a VPN connection it overides the default gateway, except for devices listed as contained within its subnet. According to the [a post][syn] on the synology forum even if the subnet is changed to 255.255.0.0 it will not see devices on another VLAN. It feels like a subnet mask of 255.255.255.0 is hardcoded.

For Allowing my Synology NAS to create a VPN connection and see device on my VLANS I had to add a *static route* defining a gatweway for the VLAN IP/subnet.

    Network Destination: 192.168.107.0  # This is the VLAN 107
    Netmask            : 255.255.255.0  # Standard netmask for a VLAN
    Gateway            : 192.168.100.1  # Gateway for the Synology NASs VLAN
    Interface          : physical interface that the Synology NAS uses to connect to the VLAN 

![screen grab of route](/images/Tech/Synology_static_route.png)

[syn]: https://community.synology.com/enu/forum/1/post/138785
