import {
  HtmlMetaDescriptor,
  useLoaderData as useRemixLoaderData,
} from '@remix-run/react';
import { json as remixJson, MetaFunction } from '@remix-run/node';
import { serialize, deserialize } from 'superjson';
import { SuperJSONResult } from 'superjson/dist/types';

type JsonResponse = ReturnType<typeof remixJson>;
type MetaArgs = Parameters<MetaFunction>[0];
type MetaArgsSansData = Omit<MetaArgs, 'data'>;

type SuperJSONMetaFunction<Data> = {
  (args: MetaArgsSansData & { data: Data }): HtmlMetaDescriptor;
};

export const json = <Data,>(
  obj: Data,
  init?: number | ResponseInit
): JsonResponse => {
  const superJsonResult = serialize(obj);
  return remixJson(superJsonResult, init);
};

export const parse = <Data,>(superJsonResult: SuperJSONResult) =>
  deserialize(superJsonResult) as Data;

export const withSuperJSON = <Data,>(
  metaFn: MetaFunction
): SuperJSONMetaFunction<Data> => ({
  data,
  ...rest
}: MetaArgs): HtmlMetaDescriptor =>
  metaFn({ ...rest, data: parse<Data>(data) });

export const useLoaderData = <Data,>() => {
  const loaderData = useRemixLoaderData<SuperJSONResult>();
  return parse<Data>(loaderData);
};
