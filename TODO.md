# Beta-blocking 
1) Line numbers show only up to line numbers rather than viewport.
   i.e. initial viewport with size 20 is 1-20, even if source is less than 20 lines
2) scroll page up / down 
3) scroll horizontal for long lines 
4) multi-cursor or rectangular selection
4.1 these features overlap in functionality
5) utf-8
6) emoji
7) tab characters


# prod-blocking
1) decide on modal-editing or mass market behavior like vscode 
2) util to chunk in large files 
3) syntax highlighting 

# test 
1) issues walkthrough if using repeat command

    1.1 two commands in repeat take up 2 walkthrough steps. the numbering is confusing and messes up the matching with the dsl source. 


    1.2 can't step to subsequent steps outside the loop  
2) need to fully audit behavior around special characters such as comma, single quote, double quote, space, forward slash, and escape sequences

3) lack way to tab visual coordinates of selection

