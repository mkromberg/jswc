# testing eWC

## Status:

* currently only executes one test at a time, subsequent tests fail.  (This is an undesired side-effect
  of a major re-org that I did yesterday and that I'm still working on - but I did not want
  to delay committing the code because of it)
- [ ] document Link problem with Selenium

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
