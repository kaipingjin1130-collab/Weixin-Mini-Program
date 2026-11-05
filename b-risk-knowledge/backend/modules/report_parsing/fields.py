"""Fixed business dictionary; original values and management attribution stay distinct."""
import re
VERSION='business-fields-20261102-v4'
FIELDS={
 'project_name':('项目名称',['上级项目名称']),
 'engineering_project_name':('工程项目',['工程名称','受检项目','项目标段']),
 'inspection_date':('检查日期',['检查日期','巡查日期','检查时间','巡查时间','督查日期']),
 'inspection_location':('检查部位',['检查部位','隐患部位','问题部位']),
 'problem_description':('问题描述',['问题描述','隐患问题描述','违规问题描述','隐患描述','问题内容','检查发现问题','隐患问题','具体隐患','问题、缺陷内容','问题、缺陷条目内容（附照片）','存在问题','存在的问题','发现问题']),
 'source_category':('原始类别',['隐患类别','问题类别','问题分类','专业类别','隐患分类','问题、缺陷条目类别']),
 'hazard_category':('隐患类别',[]),
 'source_grade':('原始等级',['隐患等级','风险等级','问题等级','隐患等级（A/B/C）','星级']),
 'basis_or_clause':('引用依据',['依据','违反依据','规范依据','依据文件','违反规范','违反条款','违反依据及条款','依据及条款']),
 'rectification_requirement':('整改要求',['整改要求','处理要求']),
 'rectification_advice':('整改建议',['整改建议','处理建议','整改措施建议']),
 'rectification_deadline':('整改期限',['整改时限','整改期限','整改时间要求','整改完成期限']),
 'reported_response':('整改回复',['整改回复','整改情况','整改结果','整改落实情况']),
 'reinspection_conclusion':('复查结论',['复查结论','复验结论','复查情况','复验结果']),
}
OPTIONAL={'rectification_deadline','reported_response','reinspection_conclusion'}
DERIVED={'hazard_category'}
CONDITIONAL={
 '项目名称':{'target':None,'candidate_targets':['project_name','engineering_project_name'],'condition':'按含义区分上级管理项目与受检工地；报告表头虽写项目名称，内容为工地名称时写engineering_project_name，不写project_name'},
 '项目名':{'target':None,'candidate_targets':['project_name','engineering_project_name'],'condition':'区分上级管理项目与受检工地，不能凭标签直接选定'},
 '所属项目':{'target':'project_name','condition':'明确指受检工程所属的上级管理项目，有隶属关系依据'},
 '工程项目':{'target':'engineering_project_name','condition':'报告实际检查的工地名称，不是上级项目或检查分项/评分项目'},
 '位置':{'target':'inspection_location','condition':'问题表中明确的问题发生位置'},
 '部位':{'target':'inspection_location','condition':'问题表中明确的问题发生部位'},
 '类别':{'target':'source_category','condition':'问题表中的问题类别，不是报告类型/对象类型'},
 '分类':{'target':'source_category','condition':'问题表中的问题类别，不是报告类型/对象类型'},
 '建议':{'target':'rectification_advice','condition':'问题表或整改建议章节内，与本条问题明确对应'},
 '整改措施':{'target':None,'condition':'按明确章节区分整改要求、建议或实际回复，不猜测'},
 '整改意见':{'target':None,'condition':'区分要求与建议，不能分清则保留原文待核'},
 '日期':{'target':None,'condition':'先确定日期角色，不能一律写检查日期'},
 '时间':{'target':None,'condition':'先确定日期角色，不能一律写检查日期'},
 '不符合内容与建议':{'target':None,'condition':'有明确文字边界才拆到问题描述和整改建议，否则保留原文待核'},
 '问题及建议':{'target':None,'condition':'同混合栏目规则'},
 '检查发现的问题及整改要求':{'target':None,'condition':'有明确文字边界才拆到问题描述和整改要求，否则保留原文待核'},
}
AMBIGUOUS={k:v['condition'] for k,v in CONDITIONAL.items()}
def label_key(s):return re.sub(r'[\s:：]+','',str(s or '')).strip()
ALIASES={}
for field,(_,aliases) in FIELDS.items():
    for alias in aliases:
        key=label_key(alias)
        if key in ALIASES and ALIASES[key]!=field:raise ValueError('Conflicting field alias: '+alias)
        ALIASES[key]=field
def resolve_label(label):return ALIASES.get(label_key(label))
def registry():
    return {'version':VERSION,'phase':'pilot_then_validated_batch','database_import_enabled':True,
      'common_field_count':10,'optional_field_count':3,'derived_reserved_field_count':1,
      'fields':[{'key':k,'name':v[0],'aliases':v[1],'profile':'derived_reserved' if k in DERIVED else 'closure_optional' if k in OPTIONAL else 'common',
                 'required_for_problem_record':k=='problem_description','value_policy':'classify_by_user_supplied_taxonomy_preserve_source_category' if k in DERIVED else 'preserve_source_value_with_provenance'} for k,v in FIELDS.items()],
      'conditional_aliases':CONDITIONAL,
      'metadata_not_business_fields':['报告名称','报告日期','原报告编号','原记录序号','原栏目名称','页码/表格/行/列','图片关系','来源路径','SHA256','解析版本','核查状态'],
      'basis_components':['规范名称','标准名称','规范编号','标准编号','条款号','条款编号','具体条款'],
      'unknown_label_policy':'retain_in_source_evidence_and_mapping_queue_do_not_create_column',
      'empty_policy':'null_in_business_row_no_full_set_of_empty_candidate_rows',
      'project_hierarchy':{'parent_field':'project_name','site_field':'engineering_project_name','relationship':'one_project_to_many_engineering_projects',
          'unresolved_policy':'authorized_directory_selection_for_parent_only; ambiguous_groups_pending','group_policy':'multiple_sites_form_a_group_no_extra_group_field_by_default',
          'provenance':'report_or_authorized_directory_distinguished_in_evidence'},
      'date_policy':{'preserve_report_values':True,'last_saved_time':'auxiliary_year_only_with_explicit_provenance','conflicting_years':'leave_null_if_no_supported_year','do_not_invent_month_or_day':True},
      'category_value_policy':'preserve_source_category_exactly_classify_separately_later',
      'classification':{'field':'hazard_category','source_field':'source_category','enabled':False,'status':'awaiting_user_taxonomy',
          'value_type':'taxonomy_category_code','metadata':['taxonomy_version','mapping_rule','classification_method','review_status'],
          'unmatched_or_ambiguous_policy':'null_and_pending_no_forced_classification','report_label_hazard_category_maps_to':'source_category'},
      'breaking_change':'v2 project_name meant the checked site; v3 uses engineering_project_name for the site and project_name for its parent. No data migration now: the trial database was deleted.',
      'historical_confirmation_policy':'do_not_import_or_apply_old_confirmations'}
