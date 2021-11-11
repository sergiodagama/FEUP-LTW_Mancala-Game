# Mancala

[//]: # ![Logo](/res/logo.png)

LTW (L.EIC FEUP) 1º semester 1º pratical work

# Naming Conventions for ids and classes

- `Geral`: BEM

- `Outter elements`: named with the correspondent tag (except from div and span, where can be used name "d" or "s"), followed by reference (only if there is consecutive outter element before), followed by id name
- `Inner elements`: named with the correspondent tag (except from div and span, where can be used name "d" or "s"), followed by parent id name, followed by id name, followed by unique modifier

- `Outter`: [tag]-[reference (only when it has to have one)]-[id_name]
- `Inner`:  [tag]-[parent_id_name (may be equal to parent on class naming)]-[id_name (may be equal to parent on class naming)]--[modifier(if needed)]

## Principles:

- ids must be all diferent, classes can and should be reused
- consecutive outter elements only have to refer the the previous one
- group of elements are enclosed by an element, the firsts are inner elements of the last

