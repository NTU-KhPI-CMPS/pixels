import { Table, TableWrapper, Tbody, Td, Th, Thead, Tr } from '@visa/nova-react'

export default function Grid({ schema, data }) {

  const heading = schema.map((column) => {
    return (
      <Th scope="col" key={column.name}>
        {column.name}
      </Th>
    )
  })

  const rows = data.map((row, id) => {
    const columns = schema.map((column) => {
      return (
        <Td key={`${id}-${column.key}`}>
          {column.mapper ? column.mapper(row) : row[column.key]}
        </Td>
      )
    })

    return (
      <Tr key={id}>
        {columns}
      </Tr>
    )
  })

  return (
    <TableWrapper>
      <Table alternate>
        <Thead>
          <Tr>
            {heading}
          </Tr>
        </Thead>
        <Tbody>
          {rows}
        </Tbody>
      </Table>
    </TableWrapper>
  )
}
