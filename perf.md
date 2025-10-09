# Performance

This documents profiles performance and documents R&D decisions.

This project has 3 pillars of performance

1. network payload size
2. How responsive the editor is 
3. capacity (how large of files we can load)

At the time of writing, the network payload size is ~3KB 
and the responsive is in <20ms. 

We will see how far we can push the capacity limit.
Eventually, but in the distant edge cases, responsiveness will degrade.
In fact, we may even see issues of correctness.

We want to profile the behavior at that boundary, perhaps study 
solutions, which informs our design decision, but not necessarily dictate it.
In simpler terms, we may discover that it's possible to handle mega large files with some tweaks but the trade-off to the vast majority of usage is not 
worth optimizing for this long tail.

# Basic Load Test with Naive File Loader 

This is load test with a "naive loader" which reads the file into the heap and splits on "\n".

30 lines 
Took 0.20 millis to scroll viewport with 30 lines. That's 5000.000298023242 FPS.
Took 1.90 millis to insert with 30 lines. That's 526.315796078077 FPS.
Took 1.60 millis to insert new line with 30 lines. That's 624.9999906867744 FPS.
Took 1.50 millis to delete line with 29 lines. That's 666.6666666666666 FPS.
Took 1.40 millis to delete character with 30 lines. That's 714.2857264499277 FPS.

500k lines, jump to viewport location 250000 x 20 
Took 0.30 millis to scroll viewport with 500001 lines. That's 3333.3332008785724 FPS.
Took 1.30 millis to insert with 500001 lines. That's 769.2307621769652 FPS.
Took 2.30 millis to insert new line with 500003 lines. That's 434.78260644216846 FPS.
Took 2.50 millis to delete line with 500002 lines. That's 400 FPS.
Took 1.10 millis to delete character with 500002 lines. That's 909.0908893868947 FPS.

5 million lines (100 megabytes), jump to viewport 2,999,999 x 20
Took 0.70 millis to scroll viewport with 5000001 lines. That's 1428.5714528998553 FPS.
Took 1.30 millis to insert with 5000000 lines. That's 769.2307621769652 FPS.
Took 6.40 millis to insert new line with 5000001 lines. That's 156.2500005820766 FPS.
Took 1.20 millis to delete character with 5000001 lines. That's 833.3333416117563 FPS.
Took 5.60 millis to delete line with 5000000 lines. That's 178.57142781116525 FPS.

10 million lines (280 megabytes), jump to viewport 
Took 0.70 millis to scroll viewport with 10000001 lines. That's 1428.5713312577295 FPS.
Took 1.30 millis to insert with 10000001 lines. That's 769.2307974459867 FPS.
Took 28.40 millis to insert new line with 10000002 lines. That's 35.211267635193735 FPS.
Took 1.30 millis to delete character with 10000001 lines. That's 769.2307974459867 FPS.
Took 4.60 millis to delete line with 10000001 lines. That's 217.3913060379389 FPS.

It took ~1 second to load the 100mb 10 million line file with the naive loader. Same as with VSCode.

We stop here for the naive loader because its limit is somewhere between the 10 million and 20 million line files. This is likely due to the string length and/or
the ability split on "\n" for such a large string. 

## File 

To avoid Git hosting excessive large files, resouces directory only contain up 200k file. The files were generated as follows:

```bash
seq 1 5000000 | awk '{print "This is line number " $1}' > 5_million_lines.txt
```

This is not representative of real files because there is alot of regularity.
However, it makes it convenient to do apples to apples comparison. 
I also don't trust that the data isn't corrupted or corrupting the app otherwise
where wrong line numbers are attributed. 

