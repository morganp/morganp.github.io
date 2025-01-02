---
layout: post
title: "Mac mini (mid 2010) 8GB memory upgrade"
date: 2011-02-02 08:30:24 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Memory
- OS X
- Performance
discuss_url: //87
url: //87/Mac_mini_%28mid_2010%29_8GB_memory_upgrade
id: 87
---
Finally got my mac mini to accept the 8GB kit I bought from [Crucial][] for £74 (apple upgrade is £409).

The Mac mini since mid 2010 has been designed to have user upgradable
 memory. I however ran in to some issues with it not recognising the new memory, not quite which step fixed it:

First reboot, while switching back on press and hold cmd-opt-p-r [Resetting PRAM and NVRAM][PRAM]. This will causes it to continuously reboot, switch off after a cylce not letting it boot up.

Second, Disconnect all cables, open up the back and take the old memory out. pulling the clips to the side the memory pops up at about 45degrees.

Third, insert lower memory, really make sure this is firmly in place by pushing in firmly while at 45-30Degeees,then press down to clip into place. non of the metal from the contacts should be showing. I think this was my main mistake when inserting this memory the first few times. Then insert the second RMA module in the higher position, this seats much easier.

Fourth, Replace back/bottom of mac mini then hold the power button down/in for 4 seconds. This causes a [SMC reset][SMC].

Last reconnect cables and power up. You can use /Applications/Utilities/Activity Monitor.app to check how much memory you now have.

If the mac just beeps, it is quite likely that the memory is not seated correctly. On a very rare occasion it would be due to a faulty memory chip. They should work one at a time in the top position though so you could test them that way.


[Crucial]: http://www.crucial.com/uk/
[PRAM]: http://support.apple.com/kb/ht1379
[SMC]: http://support.apple.com/kb/HT3964
[startup]: http://support.apple.com/kb/HT1533
