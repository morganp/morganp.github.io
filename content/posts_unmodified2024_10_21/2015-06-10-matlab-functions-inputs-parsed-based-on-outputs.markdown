---
layout: post
title: "Matlab: functions inputs parsed based on outputs"
date: 2015-06-10 20:10:54 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Matlab
published: true
---

It is quite common to detect how many input arguments have been passed to a function, using `nargin` (N arguments in).  Commonly used to set defaults for arguments not specified.

    function result = fun_name(a,b,c);
      if nargin <1
        error('a must be supplied');
      end
      if nargin <2
        b = 1; 
      end
      if nargin <3
        c = 1;
      end

      % ...

However I just discovered `nargout` (N arguments out(.

This allows the scripts to differentiate between:

    x     = fun(a)
    [x,y] = fun(a)

Example 1:

    function [ varargout ] = nargout_test( input_args )
      disp(['nargout : ', num2str(nargout)])
     
      % Set outputs
      for i=1:nargout
        varargout{i} = 0;
      end
    end
  
Example 2, changing input args usage based on number of outputs:
note the input keyword change to the input arguments `varargin` Variable argument in.

    function [ varargout ] = nargout_test( varargin )
      disp(['nargin : ', num2str(nargin)])
      disp(['nargout : ', num2str(nargout)])
     
      if nargout > 2
        error('Too many output arguments')
      end
     
      if nargout == 1
        % single output first input means something
        varargout{1} = varargin{1};
      end
     
      if nargout == 2
        % two outputs first input means some thing else
        varargout{1} = varargin{1} / varargin{2};
        varargout{2} = varargin{1} * varargin{2};
      end
     
    end


A good example is the [dcblock script by J M De Freitas][1].

Which has this syntax:

    % SYNTAX    [a] = dcblock(Fc);  
    %           [a] = dcblock(fc,fs);  
    %           [aQ] = dcblock(fc,fs,B);  
    %           [Fc,fc] = dcblock(a,fs);  
    %           dcblock(Fc)  
    %           dcblock(fc,fs)  
    %           dcblock(fc,fs,B)  

[1]: http://uk.mathworks.com/matlabcentral/fileexchange/13792-the-dc-blocking-filter/
