Title: Cloudflare Tunnel
Date: 2025-05-31 11:50 
Category: Tech
Tags: Networking
Author: morganp
Status: draft
<!--to publish change draft to published-->

Setting up Cloudflare to expose home network to the internet, even behind CGNAT.

https://youtu.be/ey4u7OUAF3c?si=7FG0Zd8zV7aS3leZ


Proxmox Runnign Docker images 

Debian VM installed

Add newly created user to sudoers

su root
vi /etc/sudoers

Adding the last line of snippet :

    # Allow members of group sudo to execute any command
    %sudo   ALL=(ALL:ALL) ALL
    youruser    ALL=(ALL) NOPASSWD:ALL

Install Docker Engine

from: https://docs.docker.com/engine/install/debian/#install-using-the-repository

    # Add Docker's official GPG key:
    sudo apt-get update
    sudo apt-get install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc
    
    # Add the repository to Apt sources:
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update


Install the Docker Engine and interfaces

    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

Test

    sudo docker run hello-world

Now back to cloudflare install it docker service as a deamon

    sudo docker run -d cloudflare/cloudflared:latest tunnel --no-autoupdate run --token eyJhIjo

<!--Image Example: image location content/images/photo.jpg-->
![photo]({attach}/images/photo.jpg)
