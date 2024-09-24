 r←iEvaluate args;z;n;m;v
⍝ Missing support for onEvent←
⍝         and Method invocation

 z←{0::0 ⋄ 2503⌶⍵}3 ⍝ Thread and its children are un-interruptible
 n←' '(≠⊆⊢)⊃args    ⍝ Names


 :If 3=2⊃args       ⍝ Function - currently monadic only
 :Select 3⊃args
     :Case 32
         r←⍎⊃args
     :Case 52 ⍝ System function
         r←(⍎⊃args)4⊃args
     :Else
        ...
     :EndSelect
 :EndIf

 :If 3=≢args        ⍝ Get
     :If ∨/m←n∊Dynamic ⍝ Need to ask client for an update
         v←(⍕⎕THIS)EWC.∆WG n←m/n
         ⍎n,'←v'
     :EndIf
     r←⍎⊃args

 :Else              ⍝ Set

     r←⍎⊃args       ⍝ Values before updates
     ⍎'(',(⊃args),')←⊃⌽args'

     :If ∨/m←n∊PropList ⍝ Need to communicate changes to client
         n←m/n
         EWC.sendWSns EWC.makeWSns(⍕⎕THIS)n(⍎(',⊂'/⍨1=≢n),⍕n)
     :EndIf
 :EndIf
