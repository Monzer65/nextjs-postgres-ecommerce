//// components/brand-combobox.tsx
//import {
//  Combobox,
//  ComboboxInput,
//  ComboboxItem,
//  ComboboxList,
//  ComboboxPopover,
//} from "@/components/ui/combobox"
//import { Brand } from "@prisma/client"
//
//export function BrandCombobox({
//  brands,
//  value,
//  onChange,
//  onCreate,
//}: {
//  brands: Brand[]
//  value: string
//  onChange: (value: string) => void
//  onCreate: (name: string) => void
//}) {
//  const [search, setSearch] = useState("")
//
//  const filteredBrands = brands.filter((brand) =>
//    brand.name.toLowerCase().includes(search.toLowerCase())
//  )
//
//  return (
//    <Combobox
//      value={value}
//      onValueChange={(value) => {
//        if (value === "__create__") {
//          onCreate(search)
//          setSearch("")
//        } else {
//          onChange(value)
//        }
//      }}
//    >
//      <ComboboxInput
//        placeholder="Select or create brand..."
//        value={search}
//        onChange={(e) => setSearch(e.target.value)}
//      />
//      <ComboboxPopover>
//        <ComboboxList>
//          {filteredBrands.map((brand) => (
//            <ComboboxItem key={brand.id} value={brand.id}>
//              {brand.name}
//            </ComboboxItem>
//          ))}
//          {search && !filteredBrands.some(b => b.name === search) && (
//            <ComboboxItem value="__create__">
//              Create "{search}"
//            </ComboboxItem>
//          )}
//        </ComboboxList>
//      </ComboboxPopover>
//    </Combobox>
//  )
//}
