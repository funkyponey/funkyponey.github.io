SELECT 
  week_from_array
FROM
  UNNEST(GENERATE_DATE_ARRAY('2016-05-16', CURRENT_DATE(), INTERVAL 1 WEEK)) week_from_array

-- this creates a weekly record from 2016-05-16 up to today's date
