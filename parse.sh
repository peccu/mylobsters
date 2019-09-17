#!/bin/sh
# from https://www.linuxjournal.com/content/parsing-rss-news-feed-bash-script
xmlgetnext () {
   local IFS='>'
   read -d '<' TAG VALUE
}

cat $1 | while xmlgetnext ; do
   case $TAG in
      'item')
         title=''
         link=''
         pubDate=''
         description=''
         ;;
      'title')
         title="$VALUE"
         ;;
      'link')
         link="$VALUE"
         ;;
      'pubDate')
         # # convert pubDate format for <time datetime="">
         # datetime=$( date --date "$VALUE" --iso-8601=minutes )
         pubDate=$( date -jf "%a, %d %b %Y %H:%M:%S %z" "$VALUE" '+%D %H:%M%P' )
         datetime=$VALUE
         # pubDate=$VALUE
         ;;
      'description')
         # convert '&lt;' and '&gt;' to '<' and '>'
         description=$( echo "$VALUE" | sed -e 's/&lt;/</g' -e 's/&gt;/>/g' )
         ;;
      '/item')
         cat<<EOF
<article>
<h3><a href="$link">$title</a></h3>
<p>$description
<span class="post-date">posted on <time
datetime="$datetime">$pubDate</time></span></p>
</article>
EOF
         ;;
      esac
done
