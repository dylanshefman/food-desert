I ran into some issues parsing the response from the Yelp API in R, so I had to use Python as well. The order in which the data passed through the files is as follows:

1. rep_points.rmd
Using the shapefile of Detroit, generate 60 random evenly-distributed points within city limits.
OUTPUT: rep_points.csv

2. get_businesses.py
Pass each of the rep_points to the Yelp API to generate a list of all businesses within Yelp's established radius from each point. This radius sometimes extends outside city limits, so some non-Detroit businesses are included in the output.
OUTPUT: businesses.csv

3. get_detroit_businesses.rmd
Using the shapefile of Detroit, generate a list of all businesses within city limits.
OUTPUT: detroit_businesses.csv

4. src/index.html, src/styles.css, src/script.js
Using detroit_businesses.csv, implement the webpage.