 r←iEvaluate args;z;m;v;a;i;n;o
⍝ Missing support for onEvent←
⍝         and Method invocation

 z←{0::0 ⋄ 2503⌶⍵}3 ⍝ Thread and its children are un-interruptible
 a←⊃args    ⍝ Names
 :If (≢a)<i←(⌽a)⍳'.' ⍝ No dot?
     o←⍕⎕THIS
 :Else ⍝ There was a dot
     o←(-i)↓a ⋄ a←(1-i)↑a
 :EndIf
 n←' '(≠⊆⊢)a~'()'

 :If 3=2⊃args       ⍝ Function - currently monadic only
     :Select 3⊃args
     :Case 32
         r←⍎a
     :Case 52 ⍝ Function
         :If 4=≢args
             r←(o⍎a)4⊃args
         :Else
             r←o⍎a
         :EndIf
     :Else
         ...
     :EndSelect
     →0
 :EndIf

 :If 3=≢args        ⍝ Get
     :If 2=⎕NC'Dynamic'
     :AndIf ∨/m←n∊Dynamic ⍝ Need to ask client for an update
         v←(⍕⎕THIS)EWC.∆WG n←m/n
         ⍎n,'←v'
     :EndIf
     r←o⍎a

 :Else              ⍝ Set

     :Trap 6
         r←o⍎a      ⍝ Values before updates
     :Else
         r←(≢n)⍴⊂⍬
     :EndTrap

     o⍎'.(',a,')←⊃⌽args'   ⍝ Set the variables

     :If ∨/m←n∊o⍎PropList ⍝ Need to communicate changes to client
         n←m/n
         EWC.sendWSns EWC.makeWSns o n(⍎(',⊂'/⍨1=≢n),⍕n)
     :EndIf
 :EndIf
