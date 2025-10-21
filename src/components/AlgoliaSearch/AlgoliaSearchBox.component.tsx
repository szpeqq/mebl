import algoliasearch from 'algoliasearch';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import { useState } from 'react';

import SearchResults from './SearchResults.component';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? 'changeme',
  process.env.NEXT_PUBLIC_ALGOLIA_PUBLIC_API_KEY ?? 'changeme',
);

// https://www.algolia.com/doc/api-reference/widgets/instantsearch/react/

/**
 * Displays Algolia search for larger resolutions that do not show the mobile menu
 */
const AlgoliaSearchBox = () => {
  const [search, setSearch] = useState<string | null>(null);
  const [hasFocus, sethasFocus] = useState<boolean>(false);

  return (
    <div className="hidden mt-2 md:inline xl:inline">
      <div className="">
        <InstantSearch
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? 'changeme'}
          searchClient={searchClient}
        >
          {/*We need to conditionally add a border because the element has position:fixed*/}
          <SearchBox
            aria-label="Search here"
            translations={{
              submitTitle: 'Search',
              resetTitle: 'Clear search text',
              placeholder: 'Search for products',
            }}
            className={`px-4 py-2 text-base bg-white border outline-none rounded ${
              hasFocus ? 'border-black' : 'border-gray-400'
            }`}
            onChange={(event) => {
              const target = event.target as HTMLInputElement;
              sethasFocus(true);
              setSearch(target.value);
            }}
            onKeyDown={(event) => {
              const target = event.target as HTMLInputElement;
              sethasFocus(true);
              setSearch(target.value);
            }}
            onReset={() => {
              setSearch(null);
            }}
          />
          {search && (
            <div className="absolute z-50 bg-white shadow-lg rounded-md mt-1 md:w-[18rem]">
              <Hits hitComponent={SearchResults} />
            </div>
          )}
        </InstantSearch>
      </div>
    </div>
  );
};

export default AlgoliaSearchBox;
