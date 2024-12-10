# How Docker works
## Overview
Each container is isolated from the host and other containers by using Linux kernel namespaces.
* Each container is given a set of namespaces that are not (usually) shared with other containers or the host
	- Each aspect (network, storage, etc) of the container gets its own namespace
## What are Kernel Namespaces?
* Comes in types
	- Mount
		+ mountpoints
	- Process ID
		+ PIDs
	- Network
		+ network devices
		+ network stacks
		+ ports
		+ inet addresses
	- Inter-process Communication
		+ System V IPC
		+ POSIX message queues
	- UNIX Time-Sharing
		+ hostname
		+ domain name
	- User ID
		+ user and group IDs
	- Control group
		+ computational resources
			* CPU
			* Memory
			* disk I/O
		+ can enforce
			* resource limits
			* prioritization
			* accounting
		+ can also be used for freezing groups of processes for checkpointing
		+ may be hierarchical
	- Time
		+ apparent system time
* Each process is a member of exactly one namespace of each type
* each namespace is isolated from all others, such that they cannot see the resources available to other namespaces
## How it all fits together
By default, each docker container gets its own namespace in each of the eight categories.  This provides kernel-level isolation from other processes.  Furthermore, the kernel itself can be run from userspace, thus allowing the container to run its own kernel independent of the host so as to manage only the resources in the container's namespaces.  If a particular aspect of a container is supposed to be shared with the host - the networking for example - then the container does not start a new `net` namespace, and therefore sees exactly the networking setup that the host does.