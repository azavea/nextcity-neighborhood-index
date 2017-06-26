#load datatables library
library(DT)
library(htmlwidgets)

#load neighborhood stress index csv
nscores <- read.csv("final_neighborhood_scores_and_data.csv")

nscores_shortTable <- nscores[c(2,3,12,15,18,21,25)]

#create data table as R object
#neighborhood_score_table <- datatable((nscores), rownames = FALSE, options = list(
#  initComplete = JS(
#    "function(settings, json) {",
#    "$(this.api().table().header()).css({'background-color': '#5B5B5B', 'color': '#fff', 'font-family': 'helvetica'});",
#    "}")
#)) %>%
#  formatCurrency(c('medinc09', 'medinc14', 'MHS2011', 'MHS2015', 'MHSDiff'), digits = 0, '$') %>%
#  formatPercentage(c('crimeChange', 'incChange', 'popChange', 'pov09', 'pov14', 'povChangePercPoint','MHSDifPerc'), 1)


#create data table as R object
neighborhood_short_score_table <- datatable((nscores_shortTable), 
  colnames=c("Neighborhood", "Category", "Crime Change", "Income Change", "Population Change", "Poverty Change", "MHS Change"), rownames = FALSE, options = list(
    initComplete = JS(
      "function(settings, json) {",
      "$(this.api().table().header()).css({'background-color': '#5B5B5B', 'color': '#fff', 'font-family': 'helvetica', 'font-size': '13px'});",
      "}"))) %>%
  formatPercentage(c('crimeChange', 'incChange', 'popChange', 'povChangePercPoint', 'MHSDifPerc'), 1) %>%
  formatStyle(c('Neighborhood', 'category', 'crimeChange', 'incChange', 'popChange', 'povChangePercPoint', 'MHSDifPerc'), fontSize = '12px', fontFamily = 'helvetica') %>%
  formatStyle(c('Neighborhood'), fontWeight = 'bold') %>%
  formatStyle('category',backgroundColor = styleEqual(c('Facing Challenges', 'Falling Behind', 'Keeping Pace', 'Making Progress', 'Ahead of the Game'), c('#1F0439', '#6F4D8F', '#9D88A6', '#DC7C4E', '#BB4107')))%>%
  formatStyle('category',color = '#FFF')



#datatable(head(iris), rownames = FALSE, options = list(
#  columnDefs = list(list(className = 'dt-center', targets = 0:4))
#))


#create htmlwidget object with neighborhood score table
#saveWidget(neighborhood_score_table, "score_table.html", selfcontained = FALSE, libdir = "src")
saveWidget(neighborhood_short_score_table, "score_table.html", selfcontained = FALSE, libdir = "src")

