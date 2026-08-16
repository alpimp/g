#!/usr/pkg/bin/tclsh
# srv.tcl
set auto_path [linsert $auto_path 0 /home/gersh/tcllib]
	package require t2ws

	proc Responder_upload {Request} {
set Content [dict get $Request Body]
set fd [open /tmp/1 w]
fconfigure $fd -translation {auto binary}
puts -nonewline $fd $Content
close $fd
#return [dict create File $Content Content-Type "application/pdf"]
return [dict create File /tmp/1 Content-Type "" Header [dict create Content-Disposition "attachment; filename=\"[file tail /tmp/1]\""]]

	}

proc Responder_download {Request} {
set File [dict get $Request URITail]

return [dict create File $File Content-Type "" Header [dict create Content-Disposition "attachment; filename=\"[file tail $File]\""]]
}


	proc Responder_GetFile {Request} {
set File [dict get $Request URITail]
if {$File==""} {
			set File "index.html" 

		};#if

		switch [file extension $File] {

			.html - .htm - .svg  {


return [dict create File $File Header [dict create Server "T2WS"] ]
		       	}

			.jpg {

return [dict create File $File  Content-Type "image/jpeg"]

		       	}
.webp {

return [dict create File $File  Content-Type "image/webp"]

		       	}


			 .png - .gif {

return [dict create File $File  Content-Type "image/png"]

		       	}


			.css {

return [dict create File $File Header [dict create Server "T2WS"] Content-Type "text/css"]

		       	}
.js {

return [dict create File $File Header [dict create Server "T2WS"] Content-Type "text/javascript"]

		       	}


#			.htmt {
#				t2ws::Log {$File}
#	return [dict create File $File IsTemplate 1 Content-Type .html]}

#	 .tcl {
#		 set Content [dict get $Request Body]
#		 set f [open $File]
#		 set Temp [read $f]
#		 close $f
#		 set TempData [eval $Temp]
#		 return [dict create File $TempData Content-Type .html]

#	 }


			.txt {
				return [dict create File $File  Content-Type "text/plain"]
			}
.pdf {
				return [dict create File $File  Content-Type "text/plain"]
			}

		

			default {
				return [dict create Status "403"]
			}

		};#switch

	};#Responder_GetFile


set Port	[t2ws::Start 8082] 
t2ws::DefineRoute $Port ::Responder_GetFile -method GET -uri "/*"
t2ws::DefineRoute $Port ::Responder_download -method GET -uri "/download/*"
t2ws::DefineRoute $Port ::Responder_upload -method POST -uri "/upload/*"

t2ws::Configure -zip_threshold 0 -log_level 2
#t2ws::DefineRoute $Port ::Responder_GetFile -method POST -uri /*
#t2ws::EnablePlugin 8080 t2ws::template
vwait forever		

