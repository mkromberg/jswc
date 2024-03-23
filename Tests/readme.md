# testing eWC

## Status:

- [ ] document Link problem with Selenium
- [ ] ultimately Selenium should be a submodule here - but that requires addressing the Link problem. Also the current "nuget Version" of Selenium uses an Bjørn's NugetConsum -> use something "official" and merge that branch into main
- [ ] Demo_Password/Treeview fail with Browser and are ok with Headless - investigate why they don't fail in headless, too!
   - optionally saving screenshots of ALL pages might help with that 
- [ ] more tests & cleanup of code


## Running tests

In order to run tests, ]dtest the desired .dyalogtest.  You can specify the tests you wish to run
following the name of the .dyalogtest file.

````
]cita.dtest C:\Git\jswc\Tests\eWC_Browser.dyalogtest Buttons
````

There also is a mini-DSL for that, so you can also use statements like this

````
]cita.dtest C:\Git\jswc\Tests\eWC_Browser.dyalogtest ~Fonts ~Password ~TreeView ~_Issue105 ~_Issue67 ~_Issue82 ~Issue90 Fonts..
````
- [ ] discuss why that is even possible ;)

You can control various aspect of test-behaviour through environment variables (or variables in #):
- `EWC_RANDOMORDER`: execute tests in random order (=1) or not (=0)
- `EWC_PROGRESSINDICATOR`: 0=no info, 1=print name of next test to session, 2=AND wait for keypress
