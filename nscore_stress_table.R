#load datatables library
library(DT)
library(htmlwidgets)

#load neighborhood stress index csv
nscores <- read.csv("final_neighborhood_scores_and_data.csv")

#create data table as R object
neighborhood_score_table <- datatable((nscores), extensions = 'Responsive', rownames = FALSE, options = list(
  initComplete = JS(
    "function(settings, json) {",
    "$(this.api().table().header()).css({'background-color': '#000', 'color': '#fff'});",
    "}")
)) %>%
  formatStyle('TotalScore',  color = 'red', backgroundColor = 'orange', fontWeight = 'bold')  %>%
  formatCurrency(c('medinc09', 'medinc14', 'MHS2011', 'MHS2015', 'MHSDiff'), digits = 0, '$') %>%
  formatPercentage(c('crimeChange', 'incChange', 'popChange', 'pov09', 'pov14', 'MHSDifPerc'), 1)

  #create htmlwidget object with neighborhood score table
saveWidget(neighborhood_score_table, "score_table.html", selfcontained = FALSE, libdir = "src")
