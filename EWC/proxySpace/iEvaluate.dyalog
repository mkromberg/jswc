 r←iEvaluate args;z;m;v;a;i;n;o;this;exec;dot;d;e;f
⍝ Missing support for onEvent←
⍝         and Method invocation

 z←{0::0 ⋄ 2503⌶⍵}3 ⍝ Thread and its children are un-interruptible
 exec←{0=≢⍺:⍎⍵ ⋄ ⍺⍎⍵}
 a←⊃args    ⍝ Names
 :If this←(≢a)<i←(⌽a)⍳'.' ⍝ No dot?
     o←'' ⍝ This space
 :Else ⍝ There was a dot
     o←(-i)↓a ⋄ a←(1-i)↑a
 :EndIf
 n←' '(≠⊆⊢)a~'()'

 :If 3=2⊃args       ⍝ Function - currently monadic only
     :Select 3⊃args
     :Case 32
         r←⍎a
     :Case 52 ⍝ Function
         f←⍎(0=≢o)↓'o⍎a'
         :If 4=≢args
             r←f 4⊃args
         :Else
             r←f
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
     r←o exec a

 :Else              ⍝ Set

     :Trap 6
         r←o exec a      ⍝ Values before updates
     :Else
         r←(≢n)⍴⊂⍬
     :EndTrap

     :Trap 0
         dot←(0≠≢o)/'.'
         m←1≠≢d←⊃⌽args
         e←(⍕o),dot,(m/'('),a,(m/')'),'←d'   ⍝ Set the variables
         ⍕e
     :Else
         ...
     :EndTrap

     :If ∨/m←n∊o⍎PropList ⍝ Need to communicate changes to client
         n←m/n
         EWC.sendWSns EWC.makeWSns o n(⍎(',⊂'/⍨1=≢n),⍕n)
     :EndIf
 :EndIf
