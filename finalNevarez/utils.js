import { useRef, useEffect } from 'react';

export const SECTION_LIST_MOCK_DATA = [
  {
    "title": "Appetizers",
    "data": [
      {
        "id": "1",
        "title": "Spinach Artichoke Dip",
        "price": "10"
      },
      {
        "id": "2",
        "title": "Hummus",
        "price": "10"
      },
      {
        "id": "3",
        "title": "Fried Calamari Rings",
        "price": "5"
      },
      {
        "id": "4",
        "title": "Fried Mushroom",
        "price": "12"
      }
    ]
  },
  {
    "title": "Salads",
    "data": [
      {
        "id": "5",
        "title": "Greek",
        "price": "7"
      },
      {
        "id": "6",
        "title": "Caesar",
        "price": "7"
      },
      {
        "id": "7",
        "title": "Tuna Salad",
        "price": "10"
      },
      {
        "id": "8",
        "title": "Grilled Chicken Salad",
        "price": "12"
      }
    ]
  },
  {
    "title": "Beverages",
    "data": [
      {
        "id": "9",
        "title": "Water",
        "price": "3"
      },
      {
        "id": "10",
        "title": "Coke",
        "price": "3"
      },
      {
        "id": "11",
        "title": "Beer",
        "price": "7"
      },
      {
        "id": "12",
        "title": "Iced Tea",
        "price": "3"
      }
    ]
  }
];

/**
 * 3. Implement this function to transform the raw data
 * retrieved by the getMenuItems() function inside the database.js file
 * into the data structure a SectionList component expects as its "sections" prop.
 * @see https://reactnative.dev/docs/sectionlist as a reference
 */
export function getSectionListData(data) {
  // SECTION_LIST_MOCK_DATA is an example of the data structure you need to return from this function.
  // The title of each section should be the category.
  // The data property should contain an array of menu items. 
  // Each item has the following properties: "id", "title" and "price"
  //console.log('Raw Data:', JSON.stringify(data, null, 2));

  {/** CHATGPT reduction
  const sections = {};
console.log(data);
  // Group menu items by category
  data.forEach((item) => {
    const category = item.category;
    if (!sections[category]) {
      sections[category] = [];
    }
    sections[category].push({
      id: String(item.id),
      title: item.title,
      price: item.price
    });
  });

  //console.log('Grouped Data:', JSON.stringify(sections, null, 2));
  // Transform the grouped data into the format expected by SectionList
  const sectionListData = Object.keys(sections).map((category) => ({
    title: category,
    data: sections[category],
  }));
  //console.log('Transformed Data:', JSON.stringify(sectionListData, null, 2));
*/}

const dataByCategory = data.reduce((acc, curr) => {
  const menuItem = {
    id: curr.id,
    title: curr.title,
    price: curr.price,
  };

  {/**The code checks if the acc object already has an array for the current menu item's category (curr.category).
  If not, it creates a new array with the current menuItem and assigns it to the category key. 
  If the array already exists, it pushes the menuItem into the existing array. */}
  if (!Array.isArray(acc[curr.category])) {
    acc[curr.category] = [menuItem];
  } else {
    acc[curr.category].push(menuItem);
  }
  console.log("wheres da cat");
  console.log("grr",acc);
  return acc;
  
{/** The accumulator (acc) is returned at the end of each iteration. 
This is crucial for the next iteration, where the accumulator will hold the accumulated result. */}

}, {});
const sectionListData = Object.entries(dataByCategory).map(([key, item]) => {
  return {
    title: key,
    data: item,
  };
});
return sectionListData;

}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
