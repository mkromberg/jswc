 iEvaluate←{z←{0::0 ⋄ 2503⌶⍵}3 ⍝ Thread and its children are un-interruptible
     ⍺←⊢
     data←⍺ iSpace.encode ⍵
     ID←iD.numid
     ss←{iSpace.session}⍣home⊢home←2∊⎕NC'iSpace.session.started' ⍝ is this true ?
     z←{iso←ss.assoc.iso
         (≢iso)≤i←iso⍳⍵:'ISOLATE: No longer accessible'⎕SIGNAL 6
         (i⊃ss.assoc.busy)←1}⍣home⊢ID
     (rc res)←z←iSend iD.tgt data      ⍝ the biz
     ok←0=rc
     ~home:{rc=0:⍵ ⋄ ⍎'#.Iso',(⍕ID),'error←rc ⍵' ⋄ ⎕SIGNAL rc}res   ⍝ call back? then we're done
     z←ss.assoc.{((iso⍳⍵)⊃busy)←0}ID
     ok:⊢res                           ⍝ spiffing!
     (,⍕(⍕rc),': ',(0⊃res),{(⍵∨.≠' ')/': ',⍵}1⊃res,'' '')iSpace.qsignal rc
        ⍝ execute expression supplied to isolate
 }
