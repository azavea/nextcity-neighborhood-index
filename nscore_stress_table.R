#load datatables library
library(DT)

#load neighborhood stress index csv
nscores <- read.csv("final_neighborhood_scores_and_data.csv")

#create data table
datatable((nscores), class = 'stripe hover', options = list(
  initComplete = JS(
    "function(settings, json) {",
    "$(this.api().table().header()).css({'background-color': '#000', 'color': '#fff'});",
    "}")
)) %>%
  formatCurrency(c('medinc09', 'medinc14', 'MHS2011', 'MHS2015', 'MHSDiff'), digits = 0, '$') %>%
  formatPercentage(c('crimeChange', 'incChange', 'popChange', 'pov09', 'pov14', 'MHSDifPerc'), 1)
