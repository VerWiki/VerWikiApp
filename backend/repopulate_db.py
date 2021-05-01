# This file is a convenient way for us to populate and repopulate our local DBs for development purposes, at least in phase 1
# where we won't have professors creating trees for us. Feel free to add more trees and other data here. This file has no role in
# production.

from pymongo import MongoClient
from db_interface import VERWIKI_DB_NAME, TREES_TABLE_NAME, Utils

if __name__ == "__main__":

    client = MongoClient("localhost", port=27017, serverSelectionTimeoutMS=1000)
    # Select the radialTrees collection (Similar to a table in SQL)
    radialTrees = client[VERWIKI_DB_NAME][TREES_TABLE_NAME]

    # Clear out all the old data
    deleted_data = radialTrees.delete_many({})

    # Sample Tree for local development
    tree1 = {
        "id": 1,
        "data": {"name": "Root", "children": [{"name": "Front", "children": []}]},
    }

    tree1["data"] = Utils.add_child_counts(tree1["data"])

    # Insert a tree
    result = radialTrees.insert_one(tree1)
    print(result.inserted_id)

    # The JSON for the tree found here: https://marmelab.com/ArchitectureTree/
    tree2 = {
        "id": 2,
        "data": {
            "name": "Wisdom",
            "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_socrates_and_plato",
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
                                    "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_the_hellenistic_era",
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
                        {
                            "name": "Self-Regulation",
                            "url": "https://cwsl.ca/wiki/doku.php?id=self_regulation",
                        },
                        {"name": "Simple Queue Service"},
                        {
                            "name": "Facebook",
                            "children": [{"name": "Comments"}, {"name": "Like Button"}],
                        },
                        {"name": "Twitter"},
                    ],
                },
                {
                    "name": "Rationality",
                    "url": "https://cwsl.ca/wiki/doku.php?id=rationality_thinking_dispositions_and_cognitive_styles",
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
                            "name": "Insight",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight",
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
                    "dependsOn": ["Self-Regulation", "Simple Queue Service"],
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
                    "dependsOn": ["Self-Regulation", "Simple Queue Service"],
                },
            ],
        },
    }

    tree2["data"] = Utils.add_child_counts(tree2["data"])
    # Insert another tree
    result = radialTrees.insert_one(tree2)
    print(result.inserted_id)

    # The JSON for the tree found here: https://observablehq.com/@d3/radial-tidy-tree
    tree3 = {
        "id": 3,
        "data": {
            "name": "flare",
            "children": [
                {
                    "name": "analytics",
                    "children": [
                        {
                            "name": "cluster",
                            "children": [
                                {"name": "AgglomerativeCluster", "value": 3938},
                                {"name": "CommunityStructure", "value": 3812},
                                {"name": "HierarchicalCluster", "value": 6714},
                                {"name": "MergeEdge", "value": 743},
                            ],
                        },
                        {
                            "name": "graph",
                            "children": [
                                {"name": "BetweennessCentrality", "value": 3534},
                                {"name": "LinkDistance", "value": 5731},
                                {"name": "MaxFlowMinCut", "value": 7840},
                                {"name": "ShortestPaths", "value": 5914},
                                {"name": "SpanningTree", "value": 3416},
                            ],
                        },
                        {
                            "name": "optimization",
                            "children": [{"name": "AspectRatioBanker", "value": 7074}],
                        },
                    ],
                },
                {
                    "name": "animate",
                    "children": [
                        {"name": "Easing", "value": 17010},
                        {"name": "FunctionSequence", "value": 5842},
                        {
                            "name": "interpolate",
                            "children": [
                                {"name": "ArrayInterpolator", "value": 1983},
                                {"name": "ColorInterpolator", "value": 2047},
                                {"name": "DateInterpolator", "value": 1375},
                                {"name": "Interpolator", "value": 8746},
                                {"name": "MatrixInterpolator", "value": 2202},
                                {"name": "NumberInterpolator", "value": 1382},
                                {"name": "ObjectInterpolator", "value": 1629},
                                {"name": "PointInterpolator", "value": 1675},
                                {"name": "RectangleInterpolator", "value": 2042},
                            ],
                        },
                        {"name": "ISchedulable", "value": 1041},
                        {"name": "Parallel", "value": 5176},
                        {"name": "Pause", "value": 449},
                        {"name": "Scheduler", "value": 5593},
                        {"name": "Sequence", "value": 5534},
                        {"name": "Transition", "value": 9201},
                        {"name": "Transitioner", "value": 19975},
                        {"name": "TransitionEvent", "value": 1116},
                        {"name": "Tween", "value": 6006},
                    ],
                },
                {
                    "name": "data",
                    "children": [
                        {
                            "name": "converters",
                            "children": [
                                {"name": "Converters", "value": 721},
                                {"name": "DelimitedTextConverter", "value": 4294},
                                {"name": "GraphMLConverter", "value": 9800},
                                {"name": "IDataConverter", "value": 1314},
                                {"name": "JSONConverter", "value": 2220},
                            ],
                        },
                        {"name": "DataField", "value": 1759},
                        {"name": "DataSchema", "value": 2165},
                        {"name": "DataSet", "value": 586},
                        {"name": "DataSource", "value": 3331},
                        {"name": "DataTable", "value": 772},
                        {"name": "DataUtil", "value": 3322},
                    ],
                },
                {
                    "name": "display",
                    "children": [
                        {"name": "DirtySprite", "value": 8833},
                        {"name": "LineSprite", "value": 1732},
                        {"name": "RectSprite", "value": 3623},
                        {"name": "TextSprite", "value": 10066},
                    ],
                },
                {"name": "flex", "children": [{"name": "FlareVis", "value": 4116}]},
                {
                    "name": "physics",
                    "children": [
                        {"name": "DragForce", "value": 1082},
                        {"name": "GravityForce", "value": 1336},
                        {"name": "IForce", "value": 319},
                        {"name": "NBodyForce", "value": 10498},
                        {"name": "Particle", "value": 2822},
                        {"name": "Simulation", "value": 9983},
                        {"name": "Spring", "value": 2213},
                        {"name": "SpringForce", "value": 1681},
                    ],
                },
                {
                    "name": "query",
                    "children": [
                        {"name": "AggregateExpression", "value": 1616},
                        {"name": "And", "value": 1027},
                        {"name": "Arithmetic", "value": 3891},
                        {"name": "Average", "value": 891},
                        {"name": "BinaryExpression", "value": 2893},
                        {"name": "Comparison", "value": 5103},
                        {"name": "CompositeExpression", "value": 3677},
                        {"name": "Count", "value": 781},
                        {"name": "DateUtil", "value": 4141},
                        {"name": "Distinct", "value": 933},
                        {"name": "Expression", "value": 5130},
                        {"name": "ExpressionIterator", "value": 3617},
                        {"name": "Fn", "value": 3240},
                        {"name": "If", "value": 2732},
                        {"name": "IsA", "value": 2039},
                        {"name": "Literal", "value": 1214},
                        {"name": "Match", "value": 3748},
                        {"name": "Maximum", "value": 843},
                        {
                            "name": "methods",
                            "children": [
                                {"name": "add", "value": 593},
                                {"name": "and", "value": 330},
                                {"name": "average", "value": 287},
                                {"name": "count", "value": 277},
                                {"name": "distinct", "value": 292},
                                {"name": "div", "value": 595},
                                {"name": "eq", "value": 594},
                                {"name": "fn", "value": 460},
                                {"name": "gt", "value": 603},
                                {"name": "gte", "value": 625},
                                {"name": "iff", "value": 748},
                                {"name": "isa", "value": 461},
                                {"name": "lt", "value": 597},
                                {"name": "lte", "value": 619},
                                {"name": "max", "value": 283},
                                {"name": "min", "value": 283},
                                {"name": "mod", "value": 591},
                                {"name": "mul", "value": 603},
                                {"name": "neq", "value": 599},
                                {"name": "not", "value": 386},
                                {"name": "or", "value": 323},
                                {"name": "orderby", "value": 307},
                                {"name": "range", "value": 772},
                                {"name": "select", "value": 296},
                                {"name": "stddev", "value": 363},
                                {"name": "sub", "value": 600},
                                {"name": "sum", "value": 280},
                                {"name": "update", "value": 307},
                                {"name": "variance", "value": 335},
                                {"name": "where", "value": 299},
                                {"name": "xor", "value": 354},
                                {"name": "_", "value": 264},
                            ],
                        },
                        {"name": "Minimum", "value": 843},
                        {"name": "Not", "value": 1554},
                        {"name": "Or", "value": 970},
                        {"name": "Query", "value": 13896},
                        {"name": "Range", "value": 1594},
                        {"name": "StringUtil", "value": 4130},
                        {"name": "Sum", "value": 791},
                        {"name": "Variable", "value": 1124},
                        {"name": "Variance", "value": 1876},
                        {"name": "Xor", "value": 1101},
                    ],
                },
                {
                    "name": "scale",
                    "children": [
                        {"name": "IScaleMap", "value": 2105},
                        {"name": "LinearScale", "value": 1316},
                        {"name": "LogScale", "value": 3151},
                        {"name": "OrdinalScale", "value": 3770},
                        {"name": "QuantileScale", "value": 2435},
                        {"name": "QuantitativeScale", "value": 4839},
                        {"name": "RootScale", "value": 1756},
                        {"name": "Scale", "value": 4268},
                        {"name": "ScaleType", "value": 1821},
                        {"name": "TimeScale", "value": 5833},
                    ],
                },
                {
                    "name": "util",
                    "children": [
                        {"name": "Arrays", "value": 8258},
                        {"name": "Colors", "value": 10001},
                        {"name": "Dates", "value": 8217},
                        {"name": "Displays", "value": 12555},
                        {"name": "Filter", "value": 2324},
                        {"name": "Geometry", "value": 10993},
                        {
                            "name": "heap",
                            "children": [
                                {"name": "FibonacciHeap", "value": 9354},
                                {"name": "HeapNode", "value": 1233},
                            ],
                        },
                        {"name": "IEvaluable", "value": 335},
                        {"name": "IPredicate", "value": 383},
                        {"name": "IValueProxy", "value": 874},
                        {
                            "name": "math",
                            "children": [
                                {"name": "DenseMatrix", "value": 3165},
                                {"name": "IMatrix", "value": 2815},
                                {"name": "SparseMatrix", "value": 3366},
                            ],
                        },
                        {"name": "Maths", "value": 17705},
                        {"name": "Orientation", "value": 1486},
                        {
                            "name": "palette",
                            "children": [
                                {"name": "ColorPalette", "value": 6367},
                                {"name": "Palette", "value": 1229},
                                {"name": "ShapePalette", "value": 2059},
                                {"name": "SizePalette", "value": 2291},
                            ],
                        },
                        {"name": "Property", "value": 5559},
                        {"name": "Shapes", "value": 19118},
                        {"name": "Sort", "value": 6887},
                        {"name": "Stats", "value": 6557},
                        {"name": "Strings", "value": 22026},
                    ],
                },
                {
                    "name": "vis",
                    "children": [
                        {
                            "name": "axis",
                            "children": [
                                {"name": "Axes", "value": 1302},
                                {"name": "Axis", "value": 24593},
                                {"name": "AxisGridLine", "value": 652},
                                {"name": "AxisLabel", "value": 636},
                                {"name": "CartesianAxes", "value": 6703},
                            ],
                        },
                        {
                            "name": "controls",
                            "children": [
                                {"name": "AnchorControl", "value": 2138},
                                {"name": "ClickControl", "value": 3824},
                                {"name": "Control", "value": 1353},
                                {"name": "ControlList", "value": 4665},
                                {"name": "DragControl", "value": 2649},
                                {"name": "ExpandControl", "value": 2832},
                                {"name": "HoverControl", "value": 4896},
                                {"name": "IControl", "value": 763},
                                {"name": "PanZoomControl", "value": 5222},
                                {"name": "SelectionControl", "value": 7862},
                                {"name": "TooltipControl", "value": 8435},
                            ],
                        },
                        {
                            "name": "data",
                            "children": [
                                {"name": "Data", "value": 20544},
                                {"name": "DataList", "value": 19788},
                                {"name": "DataSprite", "value": 10349},
                                {"name": "EdgeSprite", "value": 3301},
                                {"name": "NodeSprite", "value": 19382},
                                {
                                    "name": "render",
                                    "children": [
                                        {"name": "ArrowType", "value": 698},
                                        {"name": "EdgeRenderer", "value": 5569},
                                        {"name": "IRenderer", "value": 353},
                                        {"name": "ShapeRenderer", "value": 2247},
                                    ],
                                },
                                {"name": "ScaleBinding", "value": 11275},
                                {"name": "Tree", "value": 7147},
                                {"name": "TreeBuilder", "value": 9930},
                            ],
                        },
                        {
                            "name": "events",
                            "children": [
                                {"name": "DataEvent", "value": 2313},
                                {"name": "SelectionEvent", "value": 1880},
                                {"name": "TooltipEvent", "value": 1701},
                                {"name": "VisualizationEvent", "value": 1117},
                            ],
                        },
                        {
                            "name": "legend",
                            "children": [
                                {"name": "Legend", "value": 20859},
                                {"name": "LegendItem", "value": 4614},
                                {"name": "LegendRange", "value": 10530},
                            ],
                        },
                        {
                            "name": "operator",
                            "children": [
                                {
                                    "name": "distortion",
                                    "children": [
                                        {"name": "BifocalDistortion", "value": 4461},
                                        {"name": "Distortion", "value": 6314},
                                        {"name": "FisheyeDistortion", "value": 3444},
                                    ],
                                },
                                {
                                    "name": "encoder",
                                    "children": [
                                        {"name": "ColorEncoder", "value": 3179},
                                        {"name": "Encoder", "value": 4060},
                                        {"name": "PropertyEncoder", "value": 4138},
                                        {"name": "ShapeEncoder", "value": 1690},
                                        {"name": "SizeEncoder", "value": 1830},
                                    ],
                                },
                                {
                                    "name": "filter",
                                    "children": [
                                        {"name": "FisheyeTreeFilter", "value": 5219},
                                        {"name": "GraphDistanceFilter", "value": 3165},
                                        {"name": "VisibilityFilter", "value": 3509},
                                    ],
                                },
                                {"name": "IOperator", "value": 1286},
                                {
                                    "name": "label",
                                    "children": [
                                        {"name": "Labeler", "value": 9956},
                                        {"name": "RadialLabeler", "value": 3899},
                                        {"name": "StackedAreaLabeler", "value": 3202},
                                    ],
                                },
                                {
                                    "name": "layout",
                                    "children": [
                                        {"name": "AxisLayout", "value": 6725},
                                        {"name": "BundledEdgeRouter", "value": 3727},
                                        {"name": "CircleLayout", "value": 9317},
                                        {"name": "CirclePackingLayout", "value": 12003},
                                        {"name": "DendrogramLayout", "value": 4853},
                                        {"name": "ForceDirectedLayout", "value": 8411},
                                        {"name": "IcicleTreeLayout", "value": 4864},
                                        {"name": "IndentedTreeLayout", "value": 3174},
                                        {"name": "Layout", "value": 7881},
                                        {"name": "NodeLinkTreeLayout", "value": 12870},
                                        {"name": "PieLayout", "value": 2728},
                                        {"name": "RadialTreeLayout", "value": 12348},
                                        {"name": "RandomLayout", "value": 870},
                                        {"name": "StackedAreaLayout", "value": 9121},
                                        {"name": "TreeMapLayout", "value": 9191},
                                    ],
                                },
                                {"name": "Operator", "value": 2490},
                                {"name": "OperatorList", "value": 5248},
                                {"name": "OperatorSequence", "value": 4190},
                                {"name": "OperatorSwitch", "value": 2581},
                                {"name": "SortOperator", "value": 2023},
                            ],
                        },
                        {"name": "Visualization", "value": 16540},
                    ],
                },
            ],
        },
    }
    tree3["data"] = Utils.add_child_counts(tree3["data"])

    result = radialTrees.insert_one(tree3)
    print(result.inserted_id)

    tree4 = {
        "id": 4,
        "data": {
            "name": "PSY371",
            "url": "https://cwsl.ca/wiki/doku.php?id=psy_371_course_thesis_higher_cognitive_processes_as_wisdom",
            "children": [
                {
                    "name": "Psychology of Wisdom",
                    "children": [
                        {"name": "Mckee and Barber"},
                        {"name": "Schwartz and Sharpe"},
                        {"name": "Ardelt"},
                        {"name": "Baltes and Staudinger"},
                        {
                            "name": "Vervaeke and Ferraro",
                            "children": [{"name": "Parasitic Processing"}],
                        },
                    ],
                },
                {
                    "name": "Wisdom",
                    "children": [
                        {"name": "Meaning in Life"},
                        {
                            "name": "Self-Transcendence",
                            "children": [
                                {"name": "Noesis"},
                                {
                                    "name": "Gnosis",
                                    "children": [
                                        {"name": "Autobiographical Memory"},
                                        {"name": "Narrative Practice"},
                                    ],
                                },
                            ],
                        },
                        {"name": "Walsh", "children": [{"name": "Wise Perspectives"}]},
                        {"name": "Flourishing"},
                        {"name": "Sophrosyne"},
                        {
                            "name": "Cognitive Styles",
                            "children": [
                                {
                                    "name": "Active Open-Mindedness",
                                    "comments": "(Stanovich)",
                                },
                                {
                                    "name": "Mindfulness",
                                    "comments": "(Vervaeke)",
                                    "children": [
                                        {"name": "Metacognitive Insight"},
                                        {"name": "Mindsight"},
                                    ],
                                },
                            ],
                        },
                        {"name": "Wise Reasoning", "comments": "(Grossman and Kross)"},
                        {
                            "name": "Transformative Experience",
                            "children": [{"name": "Proleptic Rationality"}],
                        },
                    ],
                },
                {
                    "name": "Self-Regulation",
                    "children": [
                        {
                            "name": "Delay Gratification",
                            "comments": "(Ayduk and Mischel)",
                            "children": [{"name": "Dual-Process models"}],
                        },
                        {"name": "Temporal Discounting"},
                        {"name": "Abstract Symbolic Representation"},
                        {"name": "Baumeister"},
                    ],
                },
                {
                    "name": "Internalization",
                    "children": [
                        {
                            "name": "Zone of Proximal Development",
                            "comments": "(Vygotsky)",
                        },
                        {
                            "name": "Learning to Learn",
                            "children": [
                                {"name": "Dweck: Mindset Theory"},
                                {"name": "Learning Theory: S Learning Curve"},
                            ],
                        },
                    ],
                },
                {
                    "name": "Scientific Theory of RR",
                    "children": [
                        {"name": "Scientific Class", "comments": "(John Stuart Mill)"},
                        {
                            "name": "Fittedness",
                            "comments": "RR as analogy to Darwinian fittedness",
                            "children": [
                                {
                                    "name": "Theory of Relevance Realization",
                                    "comments": "(Vervaeke and Lillicrap, Varvaeke and Ferarro 2013)",
                                },
                                {
                                    "name": "Dynamical Systems Theory",
                                    "comments": "Theory of RR as virtual engine regulating Cognitive Evolution through Fittedness to environment",
                                },
                                {
                                    "name": "Darwin",
                                    "comments": "Natural Selection as virtual engine, theory of evolution as dynamical system regulating fittedness to environment",
                                },
                                {
                                    "name": "Semantic Level",
                                    "comments": "Representations presuppose RR",
                                },
                                {
                                    "name": "Syntactic Level",
                                    "comments": "Compuation presupposes RR",
                                },
                                {"name": "Level of RR as Logistical"},
                                {"name": "2 problem solving machines"},
                            ],
                        },
                        {
                            "name": "G",
                            "comments": "General Intelligence",
                            "children": [
                                {
                                    "name": "Working Memory as Relevance filter",
                                    "comments": "(Hasher)",
                                }
                            ],
                        },
                        {
                            "name": "RR&Wisdom",
                            "children": [{"name": "Metacognitive Insight"}],
                        },
                        {
                            "name": "Rationality",
                            "comments": "(Stanovich)",
                            "children": [
                                {"name": "Rationality vs. Intelligence"},
                                {"name": "Dysrationalia"},
                                {
                                    "name": "Rationality Debate",
                                    "comments": "(Stanovich and West)",
                                },
                            ],
                        },
                    ],
                },
                {
                    "name": "Problem Solving",
                    "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving",
                    "children": [
                        {
                            "name": "Insight Debate",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight",
                            "children": [
                                {"name": "Gestalt Paradigm"},
                                {"name": "Weisberg and Alba", "comments": "(1981)"},
                                {"name": "Dominowski", "comments": "(1981)"},
                            ],
                        },
                        {
                            "name": "M&W",
                            "comments": "Metcalfe and Wiebbe, (1986/1987)",
                            "children": [
                                {
                                    "name": "FOW vs. FOK",
                                    "comments": "(different curves for Insight/inference problems)",
                                }
                            ],
                        },
                        {
                            "name": "H&G",
                            "comments": "Holyoak and Gick, (1980)",
                            "children": [
                                {
                                    "name": "Transfer of Knowledge",
                                    "comments": "(Analogical Transfer)",
                                }
                            ],
                        },
                        {
                            "name": "K&S",
                            "comments": "Kaplan and Simon, (1990)",
                            "children": [
                                {"name": "Primary/Meta Space"},
                                {
                                    "name": "Notice Invariance heuristic",
                                    "comments": "(used to search for problem formulation in Meta space, return to solve in primary)",
                                },
                                {"name": "Mutilated Chessboard Problem"},
                            ],
                        },
                        {
                            "name": "Schooler",
                            "comments": "(1993)",
                            "children": [
                                {"name": "Verbal Overshadowing"},
                                {"name": "Individual Differences"},
                                {
                                    "name": "Double Dissociation",
                                    "comments": "Double Dissociation between Insight vs. Inference tasks",
                                },
                            ],
                        },
                    ],
                },
                {
                    "name": "Problem Formulation",
                    "url": "https://cwsl.ca/wiki/doku.php?id=machinery_of_attention_construal_and_problem_formulation",
                    "children": [
                        {
                            "name": "Attention",
                            "children": [
                                {"name": "Cognitive Unison", "comments": "(Cole)"},
                                {"name": "Machinery of Construal"},
                                {"name": "Framing"},
                                {"name": "Salience Landscape"},
                                {"name": "Sizing up", "comments": "(Matson)"},
                            ],
                        },
                        {
                            "name": "Insight Cascade",
                            "children": [
                                {"name": "Relies on SOC and EAS"},
                                {
                                    "name": "Network Theory",
                                    "comments": "3 Types of Networks",
                                },
                                {"name": "Attentional Scaling"},
                                {"name": "Phase-Function Fit"},
                                {"name": "Making Frame", "comments": "(Scaling Up)"},
                                {
                                    "name": "Breaking Frame",
                                    "comments": "(Scaling Down)",
                                },
                            ],
                        },
                    ],
                },
                {
                    "name": "Cog. Development",
                    "children": [
                        {"name": "Exaptation", "children": [{"name": "Embodiment"}]}
                    ],
                },
                {
                    "name": "Philosophy",
                    "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_socrates_and_plato#introduction_to_the_philosophy_of_wisdomthe_conceptual_basis_for_wisdom_as_self-transcendence_and_foolishness_as_self-deception",
                    "children": [
                        {
                            "name": "Socrates",
                            "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_socrates_and_plato#introduction_to_the_socratic_framework_of_wisdomthe_3_types_of_explanations_the_naturalistic_philosophers_and_the_sophists",
                            "children": [
                                {"name": "Elenchus"},
                                {
                                    "name": "Relevance and Truth",
                                    "comments": "1) Thales; 2) Sophists",
                                },
                                {"name": "Harry Frankfurt", "comments": "On Bullshit"},
                            ],
                        },
                        {
                            "name": "Plato",
                            "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_socrates_and_plato#introduction_to_platothe_tripartite_model_of_the_psyche_in_understanding_justice",
                            "children": [
                                {
                                    "name": "Psyche",
                                    "comments": "1) Inner Conflict; 2) Intrapsychic Order",
                                },
                                {"name": "2 Meta Desires"},
                                {"name": "Logos"},
                                {"name": "Anagoge", "comments": "Parable of the Cave"},
                            ],
                        },
                        {
                            "name": "Perspective-Taking",
                            "children": [
                                {
                                    "name": "Antisthenes",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_socrates_and_plato#understanding_antisthenes_internalizationmeta-cognition_second-order_thinking_and_vygotsky_s_zone_of_proximal_development",
                                    "comments": "1) Internalization; 2) Perspectives",
                                }
                            ],
                        },
                        {
                            "name": "Aristotle",
                            "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_aristotle",
                            "children": [
                                {"name": "Conformity Theory", "comments": "Essence"},
                                {
                                    "name": "4 types of Causation",
                                    "comments": "1) Mechanical Cause; 2) Formal Cause; 3) Material Cause; 4) Final Cause",
                                },
                                {
                                    "name": "Virtual Engine of Character",
                                    "comments": "1) Self-Actualization; 2) Hierarchy of Needs",
                                },
                                {"name": "Akrasia", "comments": "Weakness of the Will"},
                            ],
                        },
                        {
                            "name": "Cynics",
                            "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_the_hellenistic_era#introduction_to_diogenes_the_cynicthe_clinical_dimension_to_philosophy_in_the_hellenistic_era",
                        },
                        {
                            "name": "Stoicism",
                            "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_the_hellenistic_era#introduction_to_stoicismthe_process_of_identification_and_zeno_s_criticism_of_the_cynics",
                            "children": [
                                {
                                    "name": "Processes of Identification",
                                    "comments": "1) MAR (Massive/Automatic/Reactive); 2) Narrative Identity",
                                },
                                {
                                    "name": "Epictetus",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_the_hellenistic_era#stoicism_continuedthe_mar_nature_of_identification_the_fatality_of_all_things_and_epictetus_notion_of_perceived_control_over_events",
                                    "comments": "1) Judgment; 2) Locus of Control",
                                },
                                {
                                    "name": "Stoic worldview",
                                    "comments": "Logic/Physics/Ethics",
                                },
                                {
                                    "name": "Erich Fromm",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_the_hellenistic_era#modern_analogues_to_stoicismerich_fromm_modal_confusion_and_identification_with_existential_needs",
                                    "comments": "Modal Confusion",
                                },
                                {
                                    "name": "Marcus Aurelius",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_the_hellenistic_era#philosophy_as_a_spiritual_exercisestoicism_and_marcus_aurelius",
                                    "comments": "Spiritual Exercises",
                                },
                            ],
                        },
                    ],
                },
                {"name": "Meaning-Making"},
                {"name": "Meaning Crisis"},
                {
                    "name": "Second-Order Thinking",
                    "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_socrates_and_plato#psychotechnologies_metacognition_and_second_order_thinkingimplications_for_the_machinery_of_meaning-making",
                    "children": [
                        {"name": "Psychotechnologies"},
                        {"name": "Metacognition"},
                    ],
                },
                {
                    "name": "Knowing",
                    "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_socrates_and_plato#antisthenes_internalization_of_socrates_and_the_3_types_of_knowing",
                    "children": [
                        {"name": "Propositional Knowing"},
                        {"name": "Procedural Knowing"},
                        {"name": "Perspectival Knowing"},
                        {"name": "Participatory Knowing"},
                    ],
                },
                {
                    "name": "Self-Organization",
                    "children": [
                        {
                            "name": "Perkins",
                            "children": [
                                {"name": "Folly"},
                                {"name": "Bottom-Up"},
                                {"name": "Top-Down"},
                                {"name": "Emergent Activity Switching"},
                                {"name": "Sources of Folly"},
                                {"name": "Folk Psychology"},
                            ],
                        }
                    ],
                },
                {"name": "Implicit Learning", "comments": "(Reber)"},
            ],
        },
    }

tree4["data"] = Utils.add_child_counts(tree4["data"])

result = radialTrees.insert_one(tree4)
print(result.inserted_id)
