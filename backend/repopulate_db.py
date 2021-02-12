# This file is a convenient way for us to populate and repopulate our local DBs for development purposes, at least in phase 1
# where we won't have professors creating trees for us. Feel free to add more trees and other data here. This file has no role in
# production.

from pymongo import MongoClient
from db_interface import VERWIKI_DB_NAME, TREES_TABLE_NAME, LINKS_TABLE_NAME

if __name__ == "__main__":

    client = MongoClient("localhost", port=27017, serverSelectionTimeoutMS=1000)
    # Select the radialTrees collection (Similar to a table in SQL)
    radialTrees = client[VERWIKI_DB_NAME][TREES_TABLE_NAME]

    # select the nodeLinks collection
    nodeLinks = client[VERWIKI_DB_NAME][LINKS_TABLE_NAME]

    # Clear out all the old data
    deleted_data = radialTrees.delete_many({})
    deleted_links = nodeLinks.delete_many({})

    # Sample Tree for local development
    tree1 = {
        "id": 1,
        "data": {"name": "Root", "children": [{"name": "Front", "children": []}]},
    }

    # Sample link for local development
    link1 = {
        "id": "Root-1",
        "link": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_socrates_and_plato#psychotechnologies_metacognition_and_second_order_thinkingimplications_for_the_machinery_of_meaning-making",
    }

    # Insert a tree
    result = radialTrees.insert_one(tree1)
    print(result.inserted_id)
    result = nodeLinks.insert_one(link1)
    print(result.inserted_id)

    # The JSON for the tree found here: https://marmelab.com/ArchitectureTree/
    tree2 = {
        "id": 2,
        "data": {
            "name": "Root",
            "children": [
                {
                    "name": "Front",
                    "children": [
                        {
                            "name": "Website",
                            "children": [
                                {
                                    "name": "Home",
                                    "url": "www.my-media-website.com",
                                    "dependsOn": [
                                        "Content API",
                                        "Search API",
                                        "Account API",
                                        "Picture API",
                                        "Facebook",
                                        "Twitter",
                                    ],
                                    "technos": [
                                        "PHP",
                                        "Silex",
                                        "Javascript",
                                        "NGINX",
                                        "Varnish",
                                    ],
                                    "host": {"Amazon": ["fo-1", "fo-2"]},
                                },
                                {
                                    "name": "News",
                                    "children": [
                                        {"name": "World"},
                                        {"name": "Sport"},
                                        {"name": "Politics"},
                                        {"name": "Science"},
                                        {"name": "Business"},
                                        {"name": "Technology"},
                                        {"name": "Health"},
                                    ],
                                    "url": "www.my-media-website.com/*",
                                    "dependsOn": [
                                        "Content API",
                                        "Xiti",
                                        "Search API",
                                        "Google Ads",
                                        "Account API",
                                        "Picture API",
                                        "Router API",
                                        "Facebook",
                                        "Twitter",
                                    ],
                                    "technos": ["PHP", "Silex", "NGINX", "Varnish"],
                                    "host": {"Amazon": ["fo-1", "fo-2"]},
                                },
                                {
                                    "name": "Live",
                                    "url": "live.my-media-website.com",
                                    "dependsOn": [
                                        "Content API",
                                        "Picture API",
                                        "Router API",
                                        "Facebook",
                                        "Twitter",
                                    ],
                                    "technos": [
                                        "Javascript",
                                        "NodeJs",
                                        "NGINX",
                                        "Varnish",
                                    ],
                                    "host": {"Amazon": ["fo-live"]},
                                },
                                {
                                    "name": "Blogs",
                                    "url": "blogs.my-media-website.com/*",
                                    "dependsOn": ["Wordpress MU"],
                                    "technos": ["PHP", "Wordpress"],
                                    "host": {"Amazon": ["?"]},
                                },
                                {
                                    "name": "Videos",
                                    "children": [
                                        {"name": "World videos"},
                                        {"name": "Sport videos"},
                                        {"name": "Politics videos"},
                                        {"name": "Science videos"},
                                        {"name": "Business videos"},
                                        {"name": "Technology videos"},
                                        {"name": "Health videos"},
                                    ],
                                    "url": "videos.my-media-website.com",
                                    "dependsOn": [
                                        "Video Player",
                                        "Videos API",
                                        "Router API",
                                        "Search API",
                                    ],
                                    "technos": ["PHP", "Symfony", "Javascript"],
                                    "host": {"Amazon": ["fo-video"]},
                                },
                                {
                                    "name": "Jobs",
                                    "url": "jobs.my-media-website.com",
                                    "dependsOn": ["BO JobBoard"],
                                    "technos": ["PHP", "JobBoard"],
                                    "host": {"Amazon": ["?"]},
                                },
                                {
                                    "name": "Store",
                                    "url": "store.my-media-website.com",
                                    "dependsOn": ["BO Store"],
                                    "technos": ["PHP", "Zend", "Magento"],
                                    "host": {"Amazon": ["?"]},
                                },
                                {
                                    "name": "Help",
                                    "children": [
                                        {"name": "Contact"},
                                        {"name": "Privacy"},
                                        {"name": "Mobile apps"},
                                        {"name": "Using website"},
                                        {"name": "What's New"},
                                    ],
                                    "url": "help.my-media-website.com",
                                    "host": {"Amazon": ["fo-1", "fo-2"]},
                                },
                            ],
                            "dependsOn": ["Xiti", "Google Ads", "Account API"],
                        },
                        {
                            "name": "Reader",
                            "children": [
                                {"name": "RSS"},
                                {"name": "Alerts"},
                                {"name": "Favorites"},
                            ],
                            "dependsOn": ["Content API", "Search API", "Account API"],
                        },
                        {
                            "name": "Mobile",
                            "children": [
                                {
                                    "name": "iOS app",
                                    "children": [
                                        {"name": "News iOS Mobile"},
                                        {"name": "Live iOS Mobile"},
                                        {"name": "Videos iOS Mobile"},
                                    ],
                                    "technos": ["Natif", "Objective-C"],
                                },
                                {
                                    "name": "Android app",
                                    "children": [
                                        {"name": "News Android Mobile"},
                                        {"name": "Live Android Mobile"},
                                        {"name": "Videos Android Mobile"},
                                    ],
                                    "technos": ["Natif", "Android"],
                                },
                                {
                                    "name": "Windows app",
                                    "children": [
                                        {"name": "News Windows Mobile"},
                                        {"name": "Live Windows Mobile"},
                                        {"name": "Videos Windows Mobile"},
                                    ],
                                    "technos": ["Natif", "Javascript"],
                                },
                            ],
                            "dependsOn": ["Content API"],
                        },
                    ],
                },
                {
                    "name": "SaaS",
                    "children": [
                        {"name": "Xiti"},
                        {"name": "Google Ads"},
                        {"name": "Video Player"},
                        {"name": "S3 Storage"},
                        {"name": "Simple Queue Service"},
                        {
                            "name": "Facebook",
                            "children": [{"name": "Comments"}, {"name": "Like Button"}],
                        },
                        {"name": "Twitter"},
                    ],
                },
                {
                    "name": "API",
                    "children": [
                        {
                            "name": "Content API",
                            "url": "api.my-media-website.com/content",
                            "dependsOn": ["CMS"],
                            "technos": ["PHP", "Silex", "Postgresql"],
                            "host": {"Amazon": ["api-1", "api-2"]},
                        },
                        {
                            "name": "Picture API",
                            "children": [
                                {"name": "Picture API Content"},
                                {"name": "Picture API Home"},
                            ],
                            "dependsOn": ["Storage API"],
                            "url": "api.my-media-website.com/picture",
                            "technos": ["PHP", "Silex", "Postgresql"],
                            "host": {"Amazon": ["api-1", "api-2"]},
                        },
                        {
                            "name": "Router API",
                            "url": "api.my-media-website.com/router",
                            "dependsOn": ["CMS"],
                            "technos": ["PHP", "Silex", "Postgresql"],
                            "host": {"Amazon": ["api-1", "api-2"]},
                        },
                        {
                            "name": "Search API",
                            "url": "api.my-media-website.com/search",
                            "satisfaction": 0.2,
                            "technos": ["PHP", "Silex", "Postgresql"],
                            "host": {"Amazon": ["api-1", "api-2"]},
                        },
                        {
                            "name": "Account API",
                            "url": "api.my-media-website.com/account",
                            "dependsOn": ["BO Account", "CRM"],
                            "technos": ["PHP", "Silex", "Postgresql"],
                            "host": {"Amazon": ["api-1", "api-2"]},
                        },
                        {
                            "name": "SEO API",
                            "url": "api.my-media-website.com/seo",
                            "dependsOn": ["BO SEO"],
                            "technos": ["PHP", "Silex", "Postgresql"],
                            "host": {"Amazon": ["api-1", "api-2"]},
                        },
                        {
                            "name": "Export API",
                            "children": [
                                {"name": "Partner export"},
                                {"name": "RSS export"},
                                {
                                    "name": "Sitemap",
                                    "children": [
                                        {"name": "Sitemap News"},
                                        {"name": "Sitemap Videos"},
                                        {"name": "Sitemap Live"},
                                    ],
                                },
                            ],
                            "url": "api.my-media-website.com/export",
                            "dependsOn": ["CMS"],
                            "satisfaction": 0.8,
                            "technos": ["PHP", "Silex", "Postgresql"],
                            "host": {"Amazon": ["api-1", "api-2"]},
                        },
                    ],
                    "dependsOn": ["S3 Storage", "Simple Queue Service"],
                },
                {
                    "name": "Back",
                    "children": [
                        {
                            "name": "CMS",
                            "children": [
                                {"name": "BO World"},
                                {"name": "BO Sport"},
                                {"name": "BO Politics"},
                                {"name": "BO Science"},
                                {"name": "BO Business"},
                                {"name": "BO Technology"},
                                {"name": "BO Health"},
                                {"name": "BO Front page editor"},
                                {"name": "BO Section manager"},
                            ],
                            "url": "cms.my-media-website.com",
                            "technos": ["Javascript", "NodeJS", "Sails"],
                            "host": {"OVH": ["bo-1", "bo-2"]},
                        },
                        {
                            "name": "CRM",
                            "url": "?",
                            "technos": ["PHP", "SugarCRM"],
                            "satisfaction": 0.5,
                            "host": {"OVH": ["crm-1", "crm-2"]},
                        },
                        {
                            "name": "Wordpress MU",
                            "url": "?",
                            "technos": ["PHP", "Wordpress"],
                            "host": {"OVH": ["bo-1", "bo-2"]},
                        },
                        {
                            "name": "BO Videos",
                            "url": "?",
                            "technos": ["PHP", "Symfony"],
                            "host": {"OVH": ["bo-1", "bo-2"]},
                        },
                        {
                            "name": "BO Account",
                            "url": "?",
                            "technos": ["PHP", "Symfony"],
                            "host": {"OVH": ["bo-1", "bo-2"]},
                        },
                        {
                            "name": "BO SEO",
                            "children": [
                                {"name": "BO Meta home"},
                                {"name": "BO Meta content"},
                                {"name": "BO Meta links"},
                            ],
                            "url": "?",
                            "technos": ["PHP", "Symfony"],
                            "host": {"OVH": ["bo-1", "bo-2"]},
                        },
                        {
                            "name": "Import",
                            "children": [
                                {"name": "FTP Import"},
                                {"name": "RSS Import"},
                                {"name": "Custom Import"},
                            ],
                            "url": "?",
                            "technos": ["PHP", "Symfony"],
                            "host": {"OVH": ["bo-1", "bo-2"]},
                        },
                        {
                            "name": "BO JobBoard",
                            "url": "?",
                            "technos": ["PHP", "JobBoard"],
                            "host": {"OVH": ["job-1", "job-2"]},
                        },
                        {
                            "name": "BO Store",
                            "url": "?",
                            "technos": ["PHP", "Zend", "Magento"],
                            "host": {"OVH": ["store"]},
                        },
                    ],
                    "dependsOn": ["S3 Storage", "Simple Queue Service"],
                },
            ],
        },
    }
    # Insert another tree
    result = radialTrees.insert_one(tree2)
    print(result.inserted_id)

    # Sample link for local development
    link2 = {
        "id": "Root-2",
        "link": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_socrates_and_plato#psychotechnologies_metacognition_and_second_order_thinkingimplications_for_the_machinery_of_meaning-making",
    }
    result = nodeLinks.insert_one(link2)
    print(result.inserted_id)
