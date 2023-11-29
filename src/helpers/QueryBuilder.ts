import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

export const getQuery = (
  query: SelectQueryBuilder<any>,
  searchCase: string,
  repo: Repository<any>,
  searchText,
  alias?: string,
) => {
  searchCase = searchCase?.replaceAll('%22', `"`);
  searchCase = searchCase?.replaceAll('%7B', '{');
  searchCase = searchCase?.replaceAll('%7D', '}');
  searchCase = searchCase?.replaceAll('\n', '');
  searchCase = searchCase?.replaceAll(' ', '');
  const columns = repo.metadata.columns;
  const theData = searchCase?.split('?');
  theData?.map((el, index) => {
    if (el === '') {
      return;
    }
    const theJson = JSON.parse(el);
    let theCondition = '';
    let theValue = undefined;
    if (theJson.c === 'in') {
      theCondition = `${alias ? alias : query.alias}.${
        theJson.f
      } IN(:...valC${index}) `;
      theValue = theJson.v.split(',');
    } else if (theJson.c === 'like') {
      theCondition = `${alias ? alias : query.alias}.${theJson.f} ${
        theJson.c
      } :valC${index}`;
      theValue = `%${theJson.v}%`;
    } else {
      theCondition = `${alias ? alias : query.alias}.${theJson.f} ${
        theJson.c
      } :valC${index}`;
      theValue = `${theJson.v}`;
    }
    if (theJson.t === 'where') {
      query.where(theCondition, {
        [`valC${index}`]: theValue,
      });
    } else if (theJson.t === 'orWhere') {
      query.orWhere(theCondition, {
        [`valC${index}`]: theValue,
      });
    } else if (theJson.t === 'andWhere') {
      query.andWhere(theCondition, {
        [`valC${index}`]: theValue,
      });
    }
  });
  if (searchCase === '' && searchCase) {
    if (searchText !== '' && searchText) {
      columns.map((el, index) => {
        if (el.type !== 'timestamp') {
          query.orWhere(
            `CAST(${query.alias}.${el.databaseName} as nvarchar(max))  LIKE :val${index}`,
            {
              [`val${index}`]: `%${searchText}%`,
            },
          );
        }
      });
    }
  } else {
    if (searchText !== '' && searchText) {
      query.andWhere(
        new Brackets((qb) => {
          columns.map((el, index) => {
            if (el.type !== 'timestamp') {
              qb.orWhere(
                `CAST(${query.alias}.${el.databaseName} as nvarchar(max))  LIKE :val${index}`,
                {
                  [`val${index}`]: `%${searchText}%`,
                },
              );
            }
          });
        }),
      );
    }
  }
  query.getQuery();
  return query;
};

export const mergeAdvanceSQL = (
  query: SelectQueryBuilder<any>,
  searchCase: string,
  repo: Repository<any>,
  searchText,
  stuff: any,
) => {
  stuff?.select.map((el, index) => {
    if (index === 0) {
      query.select(el);
    } else {
      query.addSelect(el);
    }
  });
  if (stuff.subQuery) {
    query.from((sq) => {
      sq.select([...stuff.subQuery.query.select]);
      sq.from('XXX', stuff.subQuery.alias);
      stuff?.subQuery?.query?.joins?.map((el) => {
        if (el.type === 'inner') {
          sq.innerJoin(el.entity, el.alias, el.relation);
        } else if (el.type === 'left') {
          sq.innerJoin(el.entity, el.alias, el.relation);
        }
      });
      sq = getQuery(sq, searchCase, repo, searchText);
      stuff?.subQuery?.query?.groupBy?.map((el) => {
        sq.addGroupBy(el);
      });
      return sq;
    }, 'T');
  } else {
    if (stuff?.from) {
      query.from(stuff?.from[0], stuff?.from[1]);
    }
  }
  stuff?.joins?.map((el) => {
    if (el.type === 'inner') {
      query.innerJoin(el.entity, el.alias, el.relation);
    } else if (el.type === 'left') {
      query.innerJoin(el.entity, el.alias, el.relation);
    }
  });
  if (!stuff.subQuery) {
    query = getQuery(query, searchCase, repo, searchText);
  }
  stuff?.groupBy?.map((el) => {
    query.addGroupBy(el);
  });
};

export const bringSqlWithJoinsColumns = (
  query: SelectQueryBuilder<any>,
  repo: Repository<any>,
  stuff: any,
  alias: string,
  join_alias?: string,
  searchText?: string,
  searchCase?: string,
) => {
  repo.metadata.columns.map((col) => {
    query.addSelect(`${alias}.${col.databaseName} as ${col.databaseName}`);
  });
  stuff?.select.map((el) => {
    query.addSelect(el);
  });
  query.from(`${repo.metadata.tableName}`, `${alias}`);
  stuff?.joins?.map((el) => {
    if (el.type === 'inner') {
      query.innerJoin(el.entity, el.alias, el.relation);
    } else if (el.type === 'left') {
      query.leftJoin(el.entity, el.alias, el.relation);
    }
  });
  getQuery(
    query,
    searchCase ? searchCase : stuff?.where,
    repo,
    searchText,
    join_alias,
  );
  return query;
};
