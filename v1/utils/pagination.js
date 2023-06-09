

exports.getFuzzySearchPaginatedData = async function (
  model,
  reqQuery,
  search,
  select = "+_id"
) {
  try {
    const {
      query,
      cursor,
      page,
      limit,
      pagination,
      populate,
      lean,
      sort,
      modFunction,
    } = reqQuery;
    return search
      ? getSearchDocuments(
          model,
          search,
          select,
          { limit, page, sort, query, populate },
          modFunction
        )
      : getPaginatedDataCustom(
          model,
          {
            query,
            cursor,
            page,
            limit,
            pagination,
            populate,
            lean,
            sort,
            modFunction,
          },
          select
        );
  } catch (err) {
    throw err;
  }
};

async function getSearchDocuments(
  model,
  search,
  select = "_id",
  { limit, page, query },
  modFunction
) {
  try {
    page = page && page > 0 ? parseInt(page) : 1;
    limit = limit && limit > 0 ? parseInt(limit) : 25;
    const skipping = (page - 1) * limit;

    if (!modFunction) {
      throw new SetErrorResponse(500, "Search needs mod function");
    }
    let results = await Promise.all(
      (
        await model.fuzzy(search).skip(skipping).limit(limit)
      ).map(async (item) => {
        const modItem = await modFunction(item.document);
        return {
          ...modItem,
          _searchScore: item.similarity,
        };
      })
    );

    results = results.filter((data) => {
      return (data._searchScore >= 0.2 && !data.notSending);
    });
    const count = results?.length;

    return {
      count,
      results,
    };
  } catch (err) {
    throw err;
  }
}
