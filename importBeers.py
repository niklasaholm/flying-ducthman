import json
import urllib2

url = 'http://pub.jamaica-inn.net/fpdb/api.php?username=jorass&password=jorass&action=inventory_get'
r = urllib2.urlopen(url)
data = json.load(r)
print data
with open('offlineBeerInfo2.txt', 'w') as outfile:
	toDump=[]
	try:
		for i in data["payload"]:
			print i["beer_id"]
			url2="http://pub.jamaica-inn.net/fpdb/api.php?username=jorass&password=jorass&action=beer_data_get&beer_id="+i["beer_id"]
			r2 = urllib2.urlopen(url2)
			data2 = json.load(r2)
			toDump.append(data2["payload"]);
			#print data
	except:
		pass
	json.dump(toDump, outfile)