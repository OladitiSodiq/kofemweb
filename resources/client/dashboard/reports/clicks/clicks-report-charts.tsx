import React, {
  cloneElement,
  Fragment,
  ReactElement,
  useCallback,
  useRef,
  useState,
} from 'react';
import {LineChart} from '@common/charts/line-chart';
import {Trans} from '@common/i18n/trans';
import {FormattedNumber} from '@common/i18n/formatted-number';
import {PolarAreaChart} from '@common/charts/polar-area-chart';
import {ReferrerChart} from '@app/dashboard/reports/referrer-chart';
import {GeoChart} from '@common/admin/analytics/geo-chart/geo-chart';
import {BarChart} from '@common/charts/bar-chart';
import {
  ClicksReportMetric,
  FetchLinkReportResponse,
  useClicksReport,
} from '@app/dashboard/reports/clicks/use-clicks-report';
import {BaseChartProps} from '@common/charts/base-chart';
import {DateRangeValue} from '@common/ui/forms/input-field/date/date-range-picker/date-range-value';
import {UseQueryResult} from '@tanstack/react-query';
import {useSearchParams} from 'react-router-dom';

interface Props {
  dateRange: DateRangeValue;
  model: string;
}
export function ClicksReportCharts({dateRange, model}: Props) {
  const colGap = 'gap-12 md:gap-24 mb-12 md:mb-24';
  const rowClassName = `flex flex-col lg:flex-row lg:items-center overflow-x-auto ${colGap}`;

  return (
    <Fragment>
      <div className={rowClassName}>
        <AsyncChart metric="clicks" model={model} dateRange={dateRange}>
          {({data}) => (
            <LineChart
              className="flex-auto"
              title={<Trans message="Click count" />}
              hideLegend
              description={
                <Trans
                  message=":count total clicks"
                  values={{
                    count: (
                      <FormattedNumber value={data?.report.clicks.total || 0} />
                    ),
                  }}
                />
              }
            />
          )}
        </AsyncChart>
        <AsyncChart metric="devices" model={model} dateRange={dateRange}>
          <PolarAreaChart
            title={<Trans message="Top devices" />}
            className="max-w-500"
          />
        </AsyncChart>
      </div>
      <div className={rowClassName}>
        <AsyncChart metric="referrers" model={model} dateRange={dateRange}>
          <ReferrerChart />
        </AsyncChart>
        <GeoChartWithCities dateRange={dateRange} model={model} />
      </div>
      <div className={rowClassName}>
        <AsyncChart metric="browsers" model={model} dateRange={dateRange}>
          <BarChart
            className="max-w-500"
            direction="horizontal"
            individualBarColors
            hideLegend
            title={<Trans message="Top browsers" />}
          />
        </AsyncChart>
        <AsyncChart metric="platforms" model={model} dateRange={dateRange}>
          <PolarAreaChart
            className="max-w-500"
            title={<Trans message="Top platforms" />}
          />
        </AsyncChart>
      </div>
    </Fragment>
  );
}

function GeoChartWithCities({model, dateRange}: Props) {
  const [params, setParams] = useSearchParams();
  const selectedCountry = params.get('country') || undefined;

  const handleCountrySelected = useCallback(
    (country?: string) => {
      setParams(prev => {
        if (country) {
          prev.set('country', country);
        } else {
          prev.delete('country');
        }
        return prev;
      });
    },
    [setParams]
  );

  return (
    <AsyncChart
      metric={selectedCountry ? 'cities' : 'countries'}
      model={model}
      dateRange={dateRange}
      country={selectedCountry}
    >
      <GeoChart
        onCountrySelected={handleCountrySelected}
        country={selectedCountry}
        className="flex-auto w-1/2 lg:max-w-[740px]"
      />
    </AsyncChart>
  );
}

interface AsyncChartProps {
  children:
    | ReactElement<BaseChartProps>
    | ((
        query: UseQueryResult<FetchLinkReportResponse>
      ) => ReactElement<BaseChartProps>);
  metric: ClicksReportMetric;
  model: string;
  dateRange: DateRangeValue;
  country?: string;
}
function AsyncChart({children, metric, model, dateRange}: AsyncChartProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [params] = useSearchParams();
  const query = useClicksReport(
    {metrics: [metric], model, dateRange, country: params.get('country')},
    {isEnabled}
  );
  const chart = typeof children === 'function' ? children(query) : children;
  const observerRef = useRef<IntersectionObserver>();

  const contentRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      const observer = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setIsEnabled(true);
            observerRef.current?.disconnect();
            observerRef.current = undefined;
          }
        },
        {threshold: 0.1} // if only header is visible, don't load
      );
      observerRef.current = observer;
      observer.observe(el);
    } else if (observerRef.current) {
      observerRef.current?.disconnect();
    }
  }, []);

  return cloneElement<BaseChartProps>(chart, {
    data: query.data?.report?.[metric],
    isLoading: query.isLoading,
    contentRef,
  });
}
