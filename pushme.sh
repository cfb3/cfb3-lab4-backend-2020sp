MSG=$@
if [ -z "$MSG" ] 
then
	MSG="no comit message"
fi
echo $MSG
git add .
git commit -m "commit from script: ${MSG}"
git push -u origin master

