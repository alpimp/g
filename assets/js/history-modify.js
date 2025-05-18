    (function(){
      var url = window.location.href;
      var newFile = (Math.random() + 1).toString(36).substr(2, 4);
    //   var newFile = 'hardcoded_name';
  
      var split = url.split("/");
  
    //   console.log(window.location.pathname)
    //   console.log(split[split.length - 1]); // ouput 
  
      // check if url path ends in trailing slash
      if (window.location.pathname.slice(-1) === "/") {
        split[split.length - 2] = "" + newFile;
      // otherwise assume it's a index file
      } else {
        index = split[split.length - 1];
        indexPrefix = index.substr(0, index.indexOf('.')); // get index prefix name
        indexSuffix = index.substr(index.indexOf('.')); // get everything starting from period
        split[split.length - 1] = newFile + indexSuffix; // rewrite prefix name + re-concatenate everything else
  
      }
  
      var newUrl = split.join("/");
  
      if (typeof window.history.replaceState === 'function') {
          history.replaceState({}, '', newUrl);
      }
    })();
