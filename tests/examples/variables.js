module.exports = {
	"var1" : "val1",
	"var2" : [1, 2, 3],
	"var3" : [
		{
			"key1": "val11",
			"key2": "val12",
			"key3": "val13"
		},
		{
			"key1": "val21",
			"key2": "val22",
			"key3": "val23"
		},
		{
			"key1": "val31",
			"key2": "val32",
			"key3": "val33"
		}
	],
	"var4" : {
		"var5": "val5",
		"var6": [
			{
				"key1": "val11",
				"key2": [
					{"sub_key": "subval11" },
					{"sub_key": "subval12" },
					{"sub_key": "subval13" }
				],
			},
			{
				"key1": "val21",
				"key2": [
					{"sub_key": "subval21" },
					{"sub_key": "subval22" },
					{"sub_key": "subval23" }
				],
			},
			{
				"key1": "val31",
				"key2": [
					{"sub_key": "subval31" },
					{"sub_key": "subval32" },
					{"sub_key": "subval33" }
				],
			}
		]
	},
	"var5" : [
		"a", "b", "c"
	]
};