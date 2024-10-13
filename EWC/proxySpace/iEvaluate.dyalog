 r←iEvaluate args;z;m;v;a;i;n;o;this;exec;dot;d;e;f;caller;name;p;wgid;msg;conn;s;t
⍝ Missing support for onEvent←
⍝         and Method invocation

 z←{0::0 ⋄ 2503⌶⍵}3 ⍝ Thread and its children are un-interruptible

 exec←{0=≢⍺:⍎⍵
       a←⍎⍺
       1=≢a:a⍎⍵
       a⍎¨⊂⍵}

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
         r←o exec a
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
     :If 0<≢o       ⍝ Keep going down the rabbit hole
         r←⍎⊃args
     :Else          ⍝ We are at the bottom
         :If 2=⎕NC'Dynamic'
         :AndIf ∨/m←n∊Dynamic ⍝ Need to ask client for an update
             caller←#.EWC.findTop_EWC name←⍕⎕THIS
             (s conn)←caller⍎'_EWC.conn'
             name←caller EWC.removeCaller name
             (wgid msg)←EWC.sendWGmsg conn name(d←m/n)
             v←msg EWC.WaitForWG d s wgid
             o exec'(',(⍕d),')←',(1≠≢d)↓'⊃v'
         :EndIf
         r←o exec a
     :EndIf
 :Else              ⍝ Set
     d←4⊃args
     :Trap 6
         r←o exec a      ⍝ Values before updates
     :Else
         r←(≢n)⍴⊂⍬
     :EndTrap

     :Trap 0
         dot←(0≠≢o)/'.'
         m←' '∊a
         e←(⍕o),dot,(m/'('),a,(m/')'),'←d'   ⍝ Set the variables
         ⍎e
         :If ∨/m←(2↑¨n)∊⊂'on'
         :AndIf ∨/m←((2×m)↓¨n)∊EventList     ⍝ onEvent...
             Event←EWC.updateEvent (t←Event) (m/n) (,⊂m/⊆d)
             n,←(t≢Event)/⊂'Event'           ⍝ Add Event to list
         :EndIf
     :Else
         ...
     :EndTrap

     :If 0=≢o              ⍝ We are at the bottom
     :AndIf ∨/m←n∊PropList ⍝ Need to communicate changes to client
         :Trap 0
             n←m/n
             caller←#.EWC.findTop_EWC name←⍕⎕THIS
             name←caller EWC.removeCaller name
             v←o exec(',⊂'/⍨1=≢n),⍕n
             :If (≢v)≥i←n⍳⊂'Event'
                v[i]←⊂EWC.removeOn i⊃v
             :EndIf
             caller EWC.sendWSns EWC.makeWSns name n v
         :Else
             ...
         :EndTrap
     :EndIf
 :EndIf
