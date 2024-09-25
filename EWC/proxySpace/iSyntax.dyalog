 iSyntax←{                                  ⍝ Called to classify expressions on 700⌶'d namespaces
     ⎕ML←⎕IO←1
     c←{⌽(+/∧\' '=⍵)↓⍵}⍣2⊢⍵                 ⍝ Drop leading & trailing blanks
     '⎕'=⊃c:⊢{0::0 0 ⋄ x←⍎⍵ ⋄ c←⎕NC'x' ⋄ (2 3⍳c)⊃(2 0)(3 52)(0 0)}⍵ ⍝ assumes ⎕FNS all ambivalent
     nc←⎕NC (⊂c),n←' '(≠⊆⊢)' '@(⍸c∊'().')⊢c ⍝ Potential names
     3∊⌊|nc:3 52                            ⍝ Assume user-defined fns also ambivalent
     ¯1∊1↓nc:3 32                           ⍝ Anything not just a name is an expression
     2 0                                    ⍝ Looks like a valid list of names

     ⍝ ↓↓↓ Original isolate code
     '('=c:⊢3 32                            ⍝ if '(expr)' ⍝ 1 0 0 0 0 0
     '{'=c:⊢3 52                            ⍝ if '{defn}' ⍝ 1 1 0 1 0 0
     '#'∊⍵:⊢0 0                             ⍝ # in anything un-parenthesised is an error
                                                    ⍝ ↑ reject ops & nss
     f←',⊢-⊂⍴⊃≡+!=⍳⊣↓↑|⍪⍕⍎∊⌽~×≠>⌊∨?⌷<≢⌈≥⍷⍉∪÷⍒⊥∧⍋⊖*○⍲⍱⍟⌹⊤≤∩'

     c∊f:⊢3 52
     0>⎕NC ⍵:⊢0 0                           ⍝ primitive operators
     expr←'((2⍴⎕nc∘⊂,⎕at),''',⍵,''')'       ⍝ then what is it?
     (rc res)←iSend iD.tgt(0 expr)          ⍝ from the horse's mouth
     rc≠0:(,⍕res)iSpace.qsignal rc          ⍝ lost connection?
     (nc at)←res                            ⍝ ⎕NC ⎕AT - rc?
     nc∊3.2 3.3:⊢3 52                       ⍝ 3,32+16+4 res ambi omega
     c←⌊nc                                  ⍝ class
     c∊0 2:⊢2 0                             ⍝ undef, var
     (r fv ov)←at                           ⍝ result, valence
     w←∨/(a d w)←fv=¯2 2 1                  ⍝ (ambi, dyad, omega)
     r←c,2⊥r a d w 0 0                      ⍝ class, encoded syntax
     1:⊢r
        ⍝ return nameclass and syntax for supplied name (string)
 }
