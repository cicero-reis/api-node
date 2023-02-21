const removerQueryFields = (arrayFields, queryFields) => {
  arrayFields.forEach((el) => delete queryFields[el])
  return queryFields
}

module.exports = removerQueryFields
