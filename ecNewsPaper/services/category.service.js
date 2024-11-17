

export default{
    findAll() {
        return [
            {
                "ID": 1,
                "Name": "Điện tử",               
                "subCategories": [
                    { "ID": 1, "Name": "Máy tính"},
                    { "ID": 2, "Name": "Điện thoại"}
                ]
            },
            {
                "ID": 2,
                "Name": "Thời trang",
                "subCategories": [
                    { "ID": 3, "Name": "Nam"},
                    { "ID": 4, "Name": "Nữ"}
                ]
            },
            {
                "ID": 3,
                "Name": "Kinh doanh",               
                "subCategories": [
                    { "ID": 5, "Name": "Công nghiệp"},
                    { "ID": 6, "Name": "Nông nghiệp"}
                ]
            },
            {
                "ID": 4,
                "Name": "Khoa học",              
                "subCategories": [
                    { "ID": 7, "Name": "Trong nước"},
                    { "ID": 8, "Name": "Quốc tế"}
                ]
            },
            {
                "ID": 5,
                "Name": "Thể thao",
                "Parent_ID": null,
                "subCategories": [
                    { "ID": 9, "Name": "Liên minh"},
                    { "ID": 10, "Name": "Bóng đá"}
                ]
            },
            {
                "ID": 6,
                "Name": "Du lịch",
                "subCategories": [
                    { "ID": 11, "Name": "Trong nước"},
                    { "ID": 12, "Name": "Quốc tế"}
                ]
            }
        ]
    },


    
}