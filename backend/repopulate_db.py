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
            "name": "PSY370",
            "url": "https://cwsl.ca/wiki/doku.php?id=psy370_course_thesis_thinking_and_reasoning",
            "children": [
                {
                    "name": "Search-Inference Framework",
                    "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#newel_and_simonthe_search-inference_framework",
                    "children": [
                        {
                            "name": "General Problem Solver",
                            "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#the_gps_and_the_4_key_elements_to_a_problem",
                            "children": [],
                        },
                        {
                            "name": "Combinatorial Explosion",
                            "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#problem_formulation_in_a_theory_of_problem_solving_and_the_central_difficulties_of_search-inferenceholyoak_1990",
                            "children": [],
                        },
                        {
                            "name": "2 Problem Solving Methods",
                            "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#two_problem_solving_methods_and_the_mutilated_chessboard_problemholyoak_part_2",
                            "children": [
                                {
                                    "name": "Means-End Heuristic",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#newel_and_simon_holyoak_and_the_means-end_heuristic",
                                    "children": [],
                                }
                            ],
                        },
                        {
                            "name": "2 Types of Problems",
                            "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#two_types_of_problems_and_the_flawed_assumptions_of_the_gps",
                            "children": [],
                        },
                    ],
                },
                {
                    "name": "Gestalt Framework",
                    "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#introducing_gestalt_psychologythe_mental_set_restructuring_and_the_9-dot_problem",
                    "children": [
                        {
                            "name": "Insight",
                            "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#the_gestalt_school_revisitedinsight_restructuring_and_the_9-dot_problem",
                            "children": [],
                        },
                        {
                            "name": "S-Learning Curve",
                            "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#restructuring_and_learning_to_learnthorndike_s_learning_theory_1898_harlowe_s_learning_sets_and_the_s-learning_curve",
                            "children": [],
                        },
                        {
                            "name": "Kohler (1929)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#gestaltist_s_reply_to_thorndike_1898kohler_s_insight_experiments_1929_concerning_sultan_the_chimpanzee",
                            "children": [],
                        },
                        {
                            "name": "9-Dot Problem",
                            "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#problem_formulation_and_restructuring_within_the_gestalt_paradigmthe_9-dot_problem",
                            "children": [],
                        },
                        {
                            "name": "Duncker Radiation Problem (1945)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#duncker_1945the_2_methods_of_reformulation_and_the_radiation_problem",
                            "children": [],
                        },
                        {
                            "name": "Functional Fixedness (Maier’s Two Cord Problem)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#restructuring_fixation_and_functional_fixednessduncker_s_second_method_of_reformualtion_1945_and_maier_s_two-cord_problem_1931",
                            "children": [],
                        },
                        {
                            "name": "Wertheimer (1959)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#wertheimer_1959the_implication_of_attention_in_problem_solving",
                            "children": [],
                        },
                        {
                            "name": "Chunking and Expertise",
                            "url": "https://cwsl.ca/wiki/doku.php?id=operationalizing_problem_solving#restructuring_mental_sets_chunking_and_the_role_of_expertisedegroot_1965_chase_and_simon_1973",
                            "children": [],
                        },
                    ],
                },
                {
                    "name": "Insight Debate",
                    "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#theoretical_debate_and_experimental_competition_on_insight",
                    "children": [
                        {
                            "name": "Think Outside the Box: Weisberg and Alba (1981)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#think_outside_the_box_and_the_business_as_usual_perspectiveweisberg_and_alba_s_challenging_of_the_gestaltist_s_notion_of_fixation_1981",
                            "children": [
                                {
                                    "name": "Criticism: Dominowski (1981); Casselman and Meyer (1970)",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#criticism_of_weisberg_and_alba_1981_by_dominoswki_1981_and_casselman_and_meyer_1970confusing_necessity_and_sufficiency_and_the_single_difficulty_hypothesis",
                                    "children": [],
                                }
                            ],
                        },
                        {
                            "name": "Feeling of Knowing and Feeling of Warmth",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#feeling_of_knowing_feeling_of_warmth_and_insight_problem_solvingmetcalfe_and_wiebbe_19861987_and_their_challenging_of_the_assumptions_of_the_search-inference_framework",
                            "children": [
                                {
                                    "name": "Metcalfe and Wiebbe (1987)",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#experiment_3metcalfe_and_wiebbe_1987",
                                    "children": [],
                                }
                            ],
                        },
                        {
                            "name": "Verbal Overshadowing (Schooler)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#schooler_ohlssen_and_brooks_1993verbal_overshadowing_it_s_effects_on_insight_and_criticisms_of_the_construct",
                            "children": [
                                {
                                    "name": "Individual Differences and Insight",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#schooler_mccleod_brooks_and_melcher_1993individual_differences_and_their_implications_for_insight_problem_solving",
                                    "children": [],
                                },
                                {
                                    "name": "Criticism of Verbal Overshadowing",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#criticisms_of_verbal_overshadowing_and_the_implications_of_attention_in_insight",
                                    "children": [],
                                },
                                {
                                    "name": "Weisberg and Fleck (2004)",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#insight_the_candle_problem_and_verbal_overshadowingfleck_and_weisberg_2004",
                                    "children": [],
                                },
                            ],
                        },
                        {
                            "name": "Cognitive Leaping (Baker-Sennet and Cici 1996)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#baker-sennet_and_cici_1996cognitive_leaping_pattern_completion_and_a_hybrid_approach_to_formalizing_insight",
                            "children": [],
                        },
                        {
                            "name": "Notice Invariance Heuristic (Kaplan and Simon 1990)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#rebuttal_from_the_search-inference_frameworkkaplan_and_simon_s_in_search_of_insight_1990_the_notice_invariants_heuristic_and_the_importance_of_selectivity_in_search",
                            "children": [
                                {
                                    "name": "Mutilated Chessboard Problem",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#notice_invariance_and_the_mutilated_chessboardprescience_and_pitfalls_of_kaplan_and_simon_s_explanation_of_insight",
                                    "children": [],
                                },
                                {
                                    "name": "Gick and McGary (1992)",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#replication_of_the_notice_invariance_heuristic_in_insightgick_and_mcgarry_1992_and_the_effects_of_indexing_past_failures",
                                    "children": [],
                                },
                            ],
                        },
                        {
                            "name": "Covert Attention (Thomas and Lleras 2009)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#insight_and_covert_shifts_of_attentionthomas_and_lleras_2009",
                            "children": [],
                        },
                        {
                            "name": "Weisberg Criticism 2 (1996)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#weisberg_s_second_response_to_the_insight_debate_1996problematic_assumptions_of_insight_problems_and_a_cluster_analysis_by_gilhooly_and_murphy_2005",
                            "children": [],
                        },
                        {
                            "name": "Hemispheric Lateralization (Beeman and Kounios 2015)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#the_effects_of_cultural_artifacts_on_insightslepian_et_al_2010",
                            "children": [],
                        },
                        {
                            "name": "Positive Manifold for Insight (Gilhooly and Murphy 2005)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#response_by_gilhooly_and_murphy_2005a_cluster_analysis_of_insight_problems",
                            "children": [],
                        },
                        {
                            "name": "Slepian et al. (2010)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#the_effects_of_cultural_artifacts_on_insightslepian_et_al_2010",
                            "children": [],
                        },
                    ],
                },
                {
                    "name": "Creativity",
                    "url": "https://cwsl.ca/wiki/doku.php?id=creativity_and_analogy#the_psychology_of_creativityinsight_incubation_and_analogy_in_problem_solving",
                    "children": [
                        {
                            "name": "4 Phases in Creativity (Wallas 1926)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=creativity_and_analogy#introduction_to_creativity4_steps_to_the_creative_process_wallas_1926",
                            "children": [],
                        },
                        {
                            "name": "Boden (1990)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=creativity_and_analogy#beyond_a_common-sense_definition_of_creativity_and_it_s_use_of_analogyboden_19961998",
                            "children": [],
                        },
                        {
                            "name": "Analogy",
                            "url": "https://cwsl.ca/wiki/doku.php?id=creativity_and_analogy#introduction_to_analogy_and_it_s_role_in_creativityholyoak_1990",
                            "children": [
                                {
                                    "name": "Structure Mapping Theory",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=creativity_and_analogy#the_structure-mapping_theory_of_analogical_learninggentner_1989",
                                    "children": [],
                                }
                            ],
                        },
                    ],
                },
                {
                    "name": "Motivation",
                    "url": "https://cwsl.ca/wiki/doku.php?id=intrinsic_and_extrinsic_motivation#mechanisms_for_creativitymodels_of_motivation",
                    "children": [
                        {
                            "name": "Intrinsic and Extrinsic Motivation (Amabile 1983)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=intrinsic_and_extrinsic_motivation#mechanisms_for_creativitymodels_of_motivation",
                            "children": [],
                        },
                        {
                            "name": "Reversal Theory and Metamotivation (Apter)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=intrinsic_and_extrinsic_motivation#introduction_to_reversal_theory_and_metamotivationapter_1984_and_motivation_as_changes_in_arousal",
                            "children": [],
                        },
                        {
                            "name": "Optimal Arousal Theory (Hebb 1955)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=intrinsic_and_extrinsic_motivation#reversal_theory_versus_homeostatic_theories_of_motivationapter_1984_and_hebb_s_optimal_arousal_theory_1955",
                            "children": [],
                        },
                    ],
                },
                {
                    "name": "Rationality",
                    "url": "https://cwsl.ca/wiki/doku.php?id=rationality_thinking_dispositions_and_cognitive_styles#rationality_thinking_dispositions_and_levels_of_analysis_in_cognitive_science",
                    "children": [
                        {
                            "name": "2 Cognitive Styles",
                            "url": "https://cwsl.ca/wiki/doku.php?id=rationality_thinking_dispositions_and_cognitive_styles#psychotechnologies_second-order_thinking_and_enhancing_cognitive_scope_through_rationalityan_alternative_definition_of_the_cognitive_style",
                            "children": [],
                        },
                        {
                            "name": "Rationality Debate",
                            "url": "https://cwsl.ca/wiki/doku.php?id=rationality_debate#the_rationality_debate",
                            "children": [],
                        },
                    ],
                },
                {
                    "name": "Analogical Transfer Fortress Problem (Gick and Holyoak 1980)",
                    "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#analogical_transfer_and_insight_problem_solvinggick_and_holyoak_1980",
                    "children": [
                        {
                            "name": "Multiple Marriage Problem (Lockheart, Lamon and Gick 1998)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#response_to_gick_and_holyoak_by_lockheart_lamon_and_gick_1988propositional_versus_procedural_similarity_in_facilitating_insight_and_the_multiple_marriage_problem",
                            "children": [],
                        },
                        {
                            "name": "Needham and Begg 1991",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#explaining_analogical_transfer_in_insight_problemsneedham_and_begg_1991_and_transfer_appropriate_processing",
                            "children": [
                                {
                                    "name": "Transfer Appropriate Processing",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#transfer-appropriate_processing_in_memory_and_it_s_implications_for_insight",
                                    "children": [],
                                }
                            ],
                        },
                        {
                            "name": "Gick and Lockheart (1995)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#insight_and_automaticitycognitive_and_affective_components_of_insight_gick_and_lockhart_1995",
                            "children": [],
                        },
                    ],
                },
                {
                    "name": "Incubation Seafurt et al. (1995)",
                    "url": "https://cwsl.ca/wiki/doku.php?id=creativity_and_analogy#incubation_and_insightthe_opportunistic_assimilation_buisness_as_usual_and_prepared_mind_hypotheses_seifert_et_al_1995",
                    "children": [
                        {
                            "name": "Returning Act Hypothesis/Attention Redirection Segal (2004)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=creativity_and_analogy#segal_2004classes_of_hypotheses_and_explanations",
                            "children": [],
                        },
                        {
                            "name": "Distraction (Baird et al. 2012)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=creativity_and_analogy#distraction_mind-wandering_and_incubationbaird_et_al_2012",
                            "children": [],
                        },
                        {
                            "name": "Dodd-Smith and Ward (2002)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=creativity_and_analogy#environmental_cues_in_incubationdodds_smith_and_ward_2002",
                            "children": [],
                        },
                    ],
                },
                {
                    "name": "Attention and Construal: Cognitive Unison",
                    "url": "https://cwsl.ca/wiki/doku.php?id=machinery_of_attention_construal_and_problem_formulation#the_normativity_of_construal_and_the_machinery_of_problem_formulationattention_as_the_candidate_process_for_insight",
                    "children": [
                        {
                            "name": "Transparency to Opacity Shifting",
                            "url": "https://cwsl.ca/wiki/doku.php?id=machinery_of_attention_construal_and_problem_formulation#transparency_opacity_and_the_expansion_of_cognitive_unisonmetzinger_2003",
                            "children": [],
                        },
                        {
                            "name": "Local and Global Construal",
                            "url": "https://cwsl.ca/wiki/doku.php?id=machinery_of_attention_construal_and_problem_formulation#global_gestalt_processing_versus_local_processing_of_featuresforster_and_dannenberg_2010",
                            "children": [],
                        },
                        {
                            "name": "Sizing Up",
                            "url": "https://cwsl.ca/wiki/doku.php?id=machinery_of_attention_construal_and_problem_formulation#ill-definedness_and_problem_formulationmatson_s_sizing_up_and_the_salience_landscape",
                            "children": [],
                        },
                        {
                            "name": "Salience Landscape",
                            "url": "https://cwsl.ca/wiki/doku.php?id=machinery_of_attention_construal_and_problem_formulation#problem_formulation_sizing_up_and_the_salience_landscape",
                            "children": [],
                        },
                        {
                            "name": "Attentional Scaling",
                            "url": "https://cwsl.ca/wiki/doku.php?id=machinery_of_attention_construal_and_problem_formulation#attentional_scaling_as_the_machinery_of_insightlevels_of_construal_fundamental_framing_and_revisiting_the_salience_landscape",
                            "children": [
                                {
                                    "name": "Phase-Function Fit",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=machinery_of_attention_construal_and_problem_formulation#the_effects_of_framing_on_problem_solvingadopting_the_right_phase-function_fit",
                                    "children": [],
                                },
                                {
                                    "name": "Deautomatization (Knoblich et al. 1999)",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#knoblich_et_al_1999the_representational_change_theory_of_insight_and_transparency_to_opacity_shifting",
                                    "children": [
                                        {
                                            "name": "Mcrae and Lewis 2002",
                                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#the_effects_of_facial_recognition_and_attentional_cueing_of_navon_letters_on_verbal_overshadowingfurther_criticism_by_finger_and_pezdek_1999_macrae_and_lewis_2002_hunt_and_carol_2008",
                                            "children": [],
                                        },
                                        {
                                            "name": "Deyoung, Flanders and Peterson (2008)",
                                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#insight_and_self-deceptionthe_anomalous_card-sorting_task_deyoung_flanders_and_peterson_2008",
                                            "children": [],
                                        },
                                        {
                                            "name": "McCaffrey (2012)",
                                            "url": "https://cwsl.ca/wiki/doku.php?id=theoretical_debate_and_experimental_competition_on_insight#insight_and_innovative_problem_solvingmccaffrey_2012_and_the_generic-parts_technique",
                                            "children": [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    "name": "Mindfulness",
                    "url": "https://cwsl.ca/wiki/doku.php?id=mindfulness_as_a_cognitive_style#mindfulness_as_a_cognitive_style_operating_as_the_normativity_of_construal",
                    "children": [
                        {
                            "name": "Ren et al. (2011)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=mindfulness_as_a_cognitive_style#empirical_evidence_on_mindfulness_and_it_s_effects_on_insight_problem_solvingren_et_al_2012_ostafin_and_kassman_2012_greenberg_et_al_2012",
                            "children": [],
                        },
                        {
                            "name": "Ostafin and Kassman (2012)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=mindfulness_as_a_cognitive_style#the_effects_of_state_vs_trait_mindfulness_on_insightostafin_and_kassman_2012",
                            "children": [],
                        },
                        {
                            "name": "Greenberg et al. (2012)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=mindfulness_as_a_cognitive_style#the_effects_of_mindfulness_on_cognitive_rigidity_and_the_einstellung_effectgreenberg_et_al_2012",
                            "children": [],
                        },
                        {
                            "name": "Moore and Malinowski (2009)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=mindfulness_as_a_cognitive_style#moore_and_malinowski_2009the_effects_of_mindfulness_on_cognitive_flexibility_and_the_stroop_effect",
                            "children": [],
                        },
                        {
                            "name": "Kang et al. (2013)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=mindfulness_as_a_cognitive_style#mindfulness_as_de-automatizationkang_gruber_and_gray_2013",
                            "children": [],
                        },
                        {
                            "name": "Metacognitive Insight (Teasdale)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=mindfulness_as_a_cognitive_style#mindfulness_metacognitive_knowledge_and_metacognitive_insightteasdale_1999",
                            "children": [],
                        },
                        {
                            "name": "Mindsight (Siegel)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=mindfulness_as_a_cognitive_style#mindful_awareness_and_mindsightsiegel_2009",
                            "children": [],
                        },
                    ],
                },
                {
                    "name": "Relevance Realization",
                    "url": "https://cwsl.ca/wiki/doku.php?id=relevance_realization#a_scientific_theory_of_relevance_realizationgeneral_intelligence_self_organization_and_two_emergent_problem_solving_machines",
                    "children": [
                        {
                            "name": "Vervaeke, Lillicrap and Richards (2009)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=relevance_realization#relevance_realization_and_self-organizationvervaeke_and_ferraro_2013vervaeke_lillicrap_and_richards_2009",
                            "children": [],
                        },
                        {
                            "name": "Bioeconomy",
                            "url": "https://cwsl.ca/wiki/doku.php?id=relevance_realization#relevance_realization_and_cognitive_evolutionbioeconomy_and_the_emergence_of_two_problem-solving_machines",
                            "children": [],
                        },
                        {
                            "name": "General Intelligence",
                            "url": "https://cwsl.ca/wiki/doku.php?id=relevance_realization#relevance_realization_and_neural_connectivity_of_general_intelligenceself-organization_small-world_networks_and_working_memory",
                            "children": [],
                        },
                        {
                            "name": "Darwinian Analogy",
                            "url": "https://cwsl.ca/wiki/doku.php?id=relevance_realization#a_theory_of_relevance_realization_as_cognitive_fittednessthe_analogy_to_darwin_s_theory_of_evolution",
                            "children": [
                                {
                                    "name": "Similarity",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=relevance_realization#discussion_of_relevance_similarity_and_systematic_import_goodman_1972stuart_millnecessary_and_sufficient_features_for_a_scientific_class",
                                    "children": [],
                                }
                            ],
                        },
                        {
                            "name": "Dynamical Systems Theory",
                            "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_aristotle#reconsidering_causation_and_explanationkant_juarrero_and_dynamical_systems_theory",
                            "children": [
                                {
                                    "name": "Circular Causation",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_aristotle#juarrero_s_response_to_kant_2000aristotle_circular_causation_and_dynamical_systems_theory",
                                    "children": [
                                        {
                                            "name": "Virtual Engine",
                                            "url": "https://cwsl.ca/wiki/doku.php?id=philosophy_of_wisdom_aristotle#circular_causation_as_a_virtual_engine_of_constraintsjuarrero_2000_and_vervaeke_anderson_and_woo",
                                            "children": [],
                                        }
                                    ],
                                }
                            ],
                        },
                    ],
                },
                {
                    "name": "Dynamical Systems Theory of Insight (Stephen and Dixon 2009)",
                    "url": "https://cwsl.ca/wiki/doku.php?id=dynamical_systems_theory_of_insight#dynamical_systems_theory_of_insight",
                    "children": [
                        {
                            "name": "Self-Organization",
                            "url": "https://cwsl.ca/wiki/doku.php?id=dynamical_systems_theory_of_insight#the_role_of_emergence_of_new_structures_in_problem_solving_and_an_overview_of_the_results",
                            "children": [
                                {
                                    "name": "Self-Organizing Criticality",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=self-organizing_criticality_and_folly#self-organizing_criticality",
                                    "children": [],
                                },
                                {
                                    "name": "Emergent Activity Switching",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=self-organizing_criticality_and_folly#perkin_s_argumentemergent_activity_switching_and_self-organizing_criticality",
                                    "children": [],
                                },
                                {
                                    "name": "State Space",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=dynamical_systems_theory_of_insight#stephen_and_dixon_s_methodtracking_eye_movements_through_the_construction_of_a_state-space_takens_1981",
                                    "children": [],
                                },
                                {
                                    "name": "Network Theory",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=dynamical_systems_theory_of_insight#the_3_types_of_networksschilling_2005_and_the_implication_of_small-world_connections_within_insight",
                                    "children": [
                                        {
                                            "name": "Small World Networks",
                                            "url": "https://cwsl.ca/wiki/doku.php?id=dynamical_systems_theory_of_insight#network_functionality3_types_of_networks_and_the_trade-off_relationship_between_norms_of_efficiency_and_resiliency",
                                            "children": [],
                                        }
                                    ],
                                },
                            ],
                        },
                        {
                            "name": "Processing Fluency and Insight (Topolinski and Reber 2010)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=the_aha_experience_flow_and_the_insight_cascade#the_aha_experience_insight_and_processing_fluencytopolinski_and_reber_2010",
                            "children": [],
                        },
                        {
                            "name": "Insight Cascade",
                            "url": "https://cwsl.ca/wiki/doku.php?id=the_aha_experience_flow_and_the_insight_cascade#flow_as_spontaneous_thoughtinsight_and_implicit_learning_vervaeke_ferraro_and_herrera-bennet_2018",
                            "children": [
                                {
                                    "name": "Flow State (Csizkentmihalyi)",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=the_aha_experience_flow_and_the_insight_cascade#csikszentmihalyi_s_theory_of_optimal_experiencethe_flow_state",
                                    "children": [],
                                },
                                {
                                    "name": "Implicit Learning (Reber 1967)",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=the_aha_experience_flow_and_the_insight_cascade#implicit_learning_perceptual_learning_and_artificial_grammarreber_1967",
                                    "children": [],
                                },
                                {
                                    "name": "Educating Intuition (Hogarth)",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=the_aha_experience_flow_and_the_insight_cascade#tacit_and_deliberate_systems_of_decision_makinghogarth_2014_and_educating_intuition",
                                    "children": [],
                                },
                            ],
                        },
                    ],
                },
                {
                    "name": "Inferential Reasoning",
                    "url": "https://cwsl.ca/wiki/doku.php?id=inferential_reasoning#inferential_reasoning",
                    "children": [
                        {
                            "name": "4 Key Forms of Conditional Reasoning",
                            "url": "https://cwsl.ca/wiki/doku.php?id=inferential_reasoning#the_study_of_argumentationconditional_reasoning_and_it_s_4_key_forms",
                            "children": [],
                        },
                        {
                            "name": "Wason Selection Task (1966)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=dysrationalia#cognitive_bias_6confirmation_bias_and_the_wason_selection_task",
                            "children": [
                                {
                                    "name": "Content Effects (Griggs and Cox 1982)",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=inferential_reasoning#the_wason_selection_task_the_thematic-materials_effect_and_prior_experience_in_reasoninggriggs_and_cox_1982",
                                    "children": [],
                                },
                                {
                                    "name": "Pragmatic Reasoning Schema (Cheng and Holyoak 1985)",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=inferential_reasoning#inferential_reasoning_and_pragmatic_reasoning_schemascheng_and_holyoak_1985",
                                    "children": [],
                                },
                                {
                                    "name": "Mental Models (Johnson-Laird 1995)",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=inferential_reasoning#mental_models_and_deductive_reasoningjohnson-laird_1995",
                                    "children": [],
                                },
                                {
                                    "name": "Social Contract Theory (Gigerenzer and Hug 1992)",
                                    "url": "https://cwsl.ca/wiki/doku.php?id=inferential_reasoning#domain-specific_reasoningsocial_contracts_cheating_and_perspective_change_gigerenzer_and_hug_1992",
                                    "children": [],
                                },
                            ],
                        },
                        {
                            "name": "Task Understanding (Liberman and Klar 1996)",
                            "url": "https://cwsl.ca/wiki/doku.php?id=inferential_reasoning#hypothesis_testing_and_task_understanding_in_the_wason_selection_problemliberman_and_klar_1996",
                            "children": [],
                        },
                    ],
                },
            ],
        },
    }
    tree4["data"] = Utils.add_child_counts(tree4["data"])

    result = radialTrees.insert_one(tree4)
    print(result.inserted_id)

    tree5 = {
        "id": 5,
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
    tree5["data"] = Utils.add_child_counts(tree5["data"])

    result = radialTrees.insert_one(tree5)
    print(result.inserted_id)
